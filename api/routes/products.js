const express = require('express');
const axios = require('axios');
const router = express.Router();
const { pool } = require('../config/db');
const { parseProduct } = require('../utils/parser');
const { getDocsHtml } = require('../views/docs');

// Root route: Serve HTML documentation page
router.get('/', (req, res) => {
  res.send(getDocsHtml());
});

// 1. GET all cached products
router.get('/api/products', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured." });
    }
    const result = await pool.query('SELECT * FROM products ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET product by barcode (checks database, falls back to API, parses & caches)
router.get('/api/products/:barcode', async (req, res) => {
  const { barcode } = req.params;

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured." });
    }

    // A. Check database first
    const dbResult = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
    if (dbResult.rows.length > 0) {
      return res.json({ source: 'cache', product: dbResult.rows[0] });
    }

    // B. Query Open Food Facts API
    console.log(`Product not cached. Fetching barcode ${barcode} from Open Food Facts...`);
    const baseUrl = process.env.OPEN_FOOD_FACTS_API_URL || 'https://world.openfoodfacts.org';
    const offResponse = await axios.get(`${baseUrl}/api/v2/product/${barcode}.json`, {
      headers: {
        'User-Agent': 'CustomFoodFactsAPI/1.0 (Node.js)'
      }
    });

    if (offResponse.data.status !== 1) {
      return res.status(404).json({ error: "Product not found in Open Food Facts database" });
    }

    const { name, image_url, nutrition_facts } = parseProduct(offResponse.data.product);

    // C. Cache inside Neon PostgreSQL database
    const insertResult = await pool.query(
      `INSERT INTO products (barcode, name, image_url, nutrition_facts) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [barcode, name, image_url, JSON.stringify(nutrition_facts)]
    );

    res.json({ source: 'api', product: insertResult.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3. SCRAPE / Import Moroccan products from Open Food Facts search
router.get('/api/scrape/moroccan', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 50;

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured." });
    }

    const baseUrl = process.env.OPEN_FOOD_FACTS_API_URL || 'https://world.openfoodfacts.org';
    const url = `${baseUrl}/cgi/search.pl`;
    console.log(`Scraping page ${page} of Moroccan products from Open Food Facts...`);

    const offResponse = await axios.get(url, {
      params: {
        search_simple: 1,
        action: "process",
        json: 1,
        page,
        page_size: pageSize,
        fields: "code,product_name,product_name_fr,brands,image_url,nutriments",
        tagtype_0: "countries",
        tag_contains_0: "contains",
        tag_0: "Morocco"
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9"
      },
      timeout: 20000
    });

    const offProducts = offResponse.data.products || [];
    const importedProducts = [];

    for (const offProduct of offProducts) {
      const barcode = offProduct.code;
      if (!barcode) continue;

      const parsed = parseProduct(offProduct);

      // Upsert into Neon DB
      const result = await pool.query(
        `INSERT INTO products (barcode, name, image_url, nutrition_facts, updated_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (barcode) DO UPDATE 
         SET name = EXCLUDED.name,
             image_url = EXCLUDED.image_url,
             nutrition_facts = EXCLUDED.nutrition_facts,
             updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [barcode, parsed.name, parsed.image_url, JSON.stringify(parsed.nutrition_facts)]
      );

      importedProducts.push(result.rows[0]);
    }

    res.json({
      success: true,
      page,
      page_size: pageSize,
      total_retrieved: offProducts.length,
      total_imported: importedProducts.length,
      products: importedProducts
    });

  } catch (err) {
    console.error("Error scraping Moroccan products:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 4. PATCH update a cached product
router.patch('/api/products/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const { name, image_url, nutrition_facts } = req.body;

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured." });
    }

    const existCheck = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ error: "Product not found in custom database." });
    }

    const currentProduct = existCheck.rows[0];
    const newName = name !== undefined ? name : currentProduct.name;
    const newImageUrl = image_url !== undefined ? image_url : currentProduct.image_url;
    
    let newNutrition = currentProduct.nutrition_facts;
    if (nutrition_facts !== undefined) {
      newNutrition = { ...currentProduct.nutrition_facts, ...nutrition_facts };
    }

    const updateResult = await pool.query(
      `UPDATE products 
       SET name = $1, image_url = $2, nutrition_facts = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE barcode = $4 
       RETURNING *`,
      [newName, newImageUrl, JSON.stringify(newNutrition), barcode]
    );

    res.json({ message: "Product updated successfully", product: updateResult.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE product from database cache
router.delete('/api/products/:barcode', async (req, res) => {
  const { barcode } = req.params;
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured." });
    }
    const result = await pool.query('DELETE FROM products WHERE barcode = $1 RETURNING *', [barcode]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found in custom database." });
    }
    res.json({ message: "Product deleted from database cache.", product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
