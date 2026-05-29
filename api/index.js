const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Postgres connection pool
// For Vercel deployment, DATABASE_URL must be configured in Vercel project settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon serverless Postgres connection
  }
});

// Helper function to initialize database table
async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL not set. Running in offline/read-only fallback mode.");
    return;
  }
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        barcode VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url TEXT,
        nutrition_facts JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err.message);
  }
}

// Initialize the database schema
initDb();

// Home route with interactive API documentation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Food Cache API - Documentation</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-main: #090d16;
          --bg-card: #111827;
          --bg-input: #1f2937;
          --border: #374151;
          --text-main: #f3f4f6;
          --text-muted: #9ca3af;
          --accent-green: #10b981;
          --accent-blue: #3b82f6;
          --accent-purple: #8b5cf6;
          --accent-red: #ef4444;
          --neon-glow: rgba(59, 130, 246, 0.15);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--bg-main);
          color: var(--text-main);
          line-height: 1.6;
          padding: 2rem 1rem;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        header {
          text-align: center;
          margin-bottom: 3.5rem;
          position: relative;
        }

        header::after {
          content: '';
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, var(--neon-glow) 0%, transparent 70%);
          z-index: -1;
          pointer-events: none;
        }

        h1 {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto 1.5rem auto;
        }

        .badge-container {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .badge {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .badge-live {
          color: var(--accent-green);
          border-color: rgba(16, 185, 129, 0.3);
          background-color: rgba(16, 185, 129, 0.05);
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }

        @media (min-width: 900px) {
          .grid {
            grid-template-columns: 3fr 2fr;
          }
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          border-color: #4b5563;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .endpoint-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .method {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .method.get {
          background-color: rgba(59, 130, 246, 0.1);
          color: var(--accent-blue);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .method.patch {
          background-color: rgba(139, 92, 246, 0.1);
          color: var(--accent-purple);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .method.delete {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--accent-red);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .path {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-main);
          word-break: break-all;
        }

        .description {
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
        }

        /* Playground / Try it out styles */
        .playground-title {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        input {
          flex: 1;
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.6rem 1rem;
          color: var(--text-main);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: var(--accent-blue);
        }

        button {
          background-color: var(--accent-blue);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button:hover {
          background-color: #2563eb;
        }

        button:active {
          transform: translateY(1px);
        }

        .code-block {
          background-color: #0d1117;
          border-radius: 8px;
          padding: 1.25rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.05);
          max-height: 350px;
        }

        pre {
          color: #e6edf3;
        }

        .params-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .params-table th, .params-table td {
          text-align: left;
          padding: 0.6rem;
          border-bottom: 1px solid var(--border);
        }

        .params-table th {
          color: var(--text-muted);
          font-weight: 600;
        }

        .param-name {
          font-family: 'JetBrains Mono', monospace;
          color: var(--accent-purple);
          font-weight: 500;
        }

        .param-type {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        textarea {
          width: 100%;
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.75rem;
          color: var(--text-main);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          min-height: 120px;
          outline: none;
          resize: vertical;
          margin-bottom: 1rem;
        }

        textarea:focus {
          border-color: var(--accent-purple);
        }

        footer {
          text-align: center;
          margin-top: 5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          border-top: 1px solid var(--border);
          padding-top: 2rem;
        }

        footer a {
          color: var(--accent-blue);
          text-decoration: none;
        }

        footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Food Cache API</h1>
          <p class="subtitle">A custom, high-performance caching proxy wrapper for the Open Food Facts API powered by Neon PostgreSQL.</p>
          <div class="badge-container">
            <span class="badge badge-live">
              <span style="display:inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: var(--accent-green); animation: pulse 1.5s infinite;"></span>
              API Status: Live
            </span>
            <span class="badge">v1.0.0</span>
            <span class="badge">Neon Serverless</span>
          </div>
        </header>

        <div class="grid">
          <!-- Main Endpoints Documentation -->
          <div>
            <h2 class="section-title">Endpoints</h2>

            <!-- GET ALL -->
            <div class="card">
              <div class="endpoint-header">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <span class="method get">GET</span>
                  <span class="path">/api/products</span>
                </div>
              </div>
              <p class="description">Retrieve all product details cached inside your custom Neon database.</p>
              <div class="playground-title">Code Example (Fetch)</div>
              <div class="code-block">
                <pre>fetch('/api/products')\n  .then(res => res.json())\n  .then(data => console.log(data));</pre>
              </div>
            </div>

            <!-- GET ONE -->
            <div class="card">
              <div class="endpoint-header">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <span class="method get">GET</span>
                  <span class="path">/api/products/:barcode</span>
                </div>
              </div>
              <p class="description">Queries your Neon cache database first. If not found, requests product data from Open Food Facts, formats/cahces name, barcode, custom image and nutrition facts, and returns it.</p>
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="param-name">barcode</td>
                    <td class="param-type">string</td>
                    <td>Yes</td>
                    <td>The standard product barcode (e.g., <code>3017670149729</code>)</td>
                  </tr>
                </tbody>
              </table>
              <div class="playground-title">Code Example (Fetch)</div>
              <div class="code-block">
                <pre>fetch('/api/products/3017670149729')\n  .then(res => res.json())\n  .then(data => console.log(data));</pre>
              </div>
            </div>

            <!-- PATCH UPDATE -->
            <div class="card">
              <div class="endpoint-header">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <span class="method patch">PATCH</span>
                  <span class="path">/api/products/:barcode</span>
                </div>
              </div>
              <p class="description">Customize cached product fields (such as updating names, overriding photos you do not like, or editing nutrition facts).</p>
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Body Field</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="param-name">name</td>
                    <td class="param-type">string</td>
                    <td>Custom name for the product</td>
                  </tr>
                  <tr>
                    <td class="param-name">image_url</td>
                    <td class="param-type">string</td>
                    <td>Custom image URL to override the Open Food Facts photo</td>
                  </tr>
                  <tr>
                    <td class="param-name">nutrition_facts</td>
                    <td class="param-type">object</td>
                    <td>JSON object containing dynamic nutrient key-values</td>
                  </tr>
                </tbody>
              </table>
              <div class="playground-title">Request Body Example</div>
              <div class="code-block">
                <pre>{\n  "name": "Super Nutella Custom",\n  "image_url": "https://images.unsplash.com/photo-1541658016709-82535e94bc69"\n}</pre>
              </div>
            </div>

            <!-- DELETE -->
            <div class="card">
              <div class="endpoint-header">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <span class="method delete">DELETE</span>
                  <span class="path">/api/products/:barcode</span>
                </div>
              </div>
              <p class="description">Evict a product from the database cache.</p>
            </div>
          </div>

          <!-- Interactive Playground Sidebar -->
          <div>
            <h2 class="section-title">API Playground</h2>
            <div class="card" style="position: sticky; top: 2rem;">
              <p class="description">Test the API directly in your browser. Enter a barcode to fetch it live.</p>
              
              <div class="playground-title">1. Fetch Product</div>
              <div class="input-group">
                <input type="text" id="barcode-input" placeholder="e.g. 3017670149729" value="3017670149729">
                <button onclick="testFetch()">Send</button>
              </div>

              <div class="playground-title" style="margin-top: 1.5rem;">2. Customize Image/Name</div>
              <div class="input-group" style="flex-direction: column; gap: 0.5rem;">
                <input type="text" id="patch-name" placeholder="Custom Product Name">
                <input type="text" id="patch-image" placeholder="Custom Image URL">
                <button onclick="testPatch()" style="background-color: var(--accent-purple); align-self: flex-start;">Update Product</button>
              </div>

              <div class="playground-title" style="margin-top: 1.5rem;">Response</div>
              <div class="code-block" style="background-color: #0b0e14;">
                <pre id="response-output">// Click "Send" or "Update Product" to run queries...</pre>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <p>Powered by <a href="https://world.openfoodfacts.org/" target="_blank">Open Food Facts Data</a> and <a href="https://neon.tech" target="_blank">Neon PostgreSQL</a>.</p>
        </footer>
      </div>

      <script>
        async function testFetch() {
          const barcode = document.getElementById('barcode-input').value.trim();
          const output = document.getElementById('response-output');
          if (!barcode) {
            output.textContent = '// Please enter a barcode.';
            return;
          }
          output.textContent = '// Requesting...';
          try {
            const res = await fetch(\`/api/products/\${barcode}\`);
            const data = await res.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            // Prefill update fields
            if (data.product) {
              document.getElementById('patch-name').value = data.product.name || '';
              document.getElementById('patch-image').value = data.product.image_url || '';
            }
          } catch (err) {
            output.textContent = '// Error: ' + err.message;
          }
        }

        async function testPatch() {
          const barcode = document.getElementById('barcode-input').value.trim();
          const name = document.getElementById('patch-name').value.trim();
          const image_url = document.getElementById('patch-image').value.trim();
          const output = document.getElementById('response-output');
          
          if (!barcode) {
            output.textContent = '// Please search/enter a barcode first.';
            return;
          }
          output.textContent = '// Updating...';
          try {
            const res = await fetch(\`/api/products/\${barcode}\`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, image_url })
            });
            const data = await res.json();
            output.textContent = JSON.stringify(data, null, 2);
          } catch (err) {
            output.textContent = '// Error: ' + err.message;
          }
        }
      </script>

      <style>
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      </style>
    </body>
    </html>
  `);
});

// 1. GET all cached products
app.get('/api/products', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured. Add DATABASE_URL to your environment variables." });
    }
    const result = await pool.query('SELECT * FROM products ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET product by barcode (caching mechanism)
app.get('/api/products/:barcode', async (req, res) => {
  const { barcode } = req.params;

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured. Add DATABASE_URL to your environment variables." });
    }

    // A. Check database first
    const dbResult = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
    if (dbResult.rows.length > 0) {
      return res.json({ source: 'cache', product: dbResult.rows[0] });
    }

    // B. If not in DB, fetch from Open Food Facts API
    console.log(`Product not cached. Fetching barcode ${barcode} from Open Food Facts...`);
    const offResponse = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
      headers: {
        'User-Agent': 'CustomFoodFactsAPI/1.0 (Node.js)'
      }
    });

    if (offResponse.data.status !== 1) {
      return res.status(404).json({ error: "Product not found in Open Food Facts database" });
    }

    const offProduct = offResponse.data.product;

    // Parse necessary data
    const name = offProduct.product_name || offProduct.generic_name || 'Unknown Product';
    const image_url = offProduct.image_url || offProduct.image_front_url || '';
    
    // Extract key nutriments
    const nutriments = offProduct.nutriments || {};
    const nutrition_facts = {
      energy_kcal_100g: nutriments['energy-kcal_100g'] ?? null,
      energy_kj_100g: nutriments['energy-kj_100g'] ?? null,
      fat_100g: nutriments.fat_100g ?? null,
      saturated_fat_100g: nutriments['saturated-fat_100g'] ?? null,
      carbohydrates_100g: nutriments.carbohydrates_100g ?? null,
      sugars_100g: nutriments.sugars_100g ?? null,
      proteins_100g: nutriments.proteins_100g ?? null,
      salt_100g: nutriments.salt_100g ?? null,
      sodium_100g: nutriments.sodium_100g ?? null,
      fiber_100g: nutriments.fiber_100g ?? null
    };

    // C. Cache it in database
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

// 3. PATCH update a cached product (for customizing name, images, or nutrition facts)
app.patch('/api/products/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const { name, image_url, nutrition_facts } = req.body;

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured." });
    }

    // Check if product exists first
    const existCheck = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
    if (existCheck.rows.length === 0) {
      return res.status(404).json({ error: "Product not found in custom database. Query it first to cache it." });
    }

    const currentProduct = existCheck.rows[0];
    const newName = name !== undefined ? name : currentProduct.name;
    const newImageUrl = image_url !== undefined ? image_url : currentProduct.image_url;
    
    // Merge nutrition facts if partially updated
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

// 4. DELETE product from local cache
app.delete('/api/products/:barcode', async (req, res) => {
  const { barcode } = req.params;
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Database not configured." });
    }
    const result = await pool.query('DELETE FROM products WHERE barcode = $1 RETURNING *', [barcode]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found in custom database." });
    }
    res.json({ message: "Product deleted from custom cache database.", product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Port initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
