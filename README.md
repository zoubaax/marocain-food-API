# Moroccan Food API Cache

A curated API for Moroccan food products, built and maintained by [Zoubaa Mohammed](https://zoubaa.dev/) and powered by Neon PostgreSQL.

## Base URL
All API requests should be made to:
`https://marocain-food-api.vercel.app`

## Endpoints and Usage

### 1. Fetch a Product
Retrieve details (name, barcode, image, and nutrition facts) of a specific product by its barcode.
- **Endpoint**: `GET /api/products/:barcode`
- **Example Request**:
  ```bash
  curl https://marocain-food-api.vercel.app/api/products/3017670149729
  ```
- **Example Response**:
  ```json
  {
    "success": true,
    "product": {
      "barcode": "3017670149729",
      "name": "Product Name",
      "image_url": "https://...",
      "nutrition_facts": {
        "energy_kcal_100g": 100,
        "fat_100g": 10
      }
    }
  }
  ```

### 2. List Cached Products
Retrieve a list of all products currently stored in the database.
- **Endpoint**: `GET /api/products`
- **Example Request**:
  ```bash
  curl https://marocain-food-api.vercel.app/api/products
  ```

### 3. Update Custom Details
You can customize the product's name or image to override the default ones.
- **Endpoint**: `PATCH /api/products/:barcode`
- **Headers**: `Content-Type: application/json`
- **Body Parameters**:
  - `name` (String, Optional)
  - `image_url` (String, Optional)
- **Example Request (JavaScript)**:
  ```javascript
  fetch("https://marocain-food-api.vercel.app/api/products/3017670149729", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name: "My Custom Product Name", 
      image_url: "https://example.com/my-custom-image.png" 
    })
  });
  ```

### 4. Remove a Product
Evict a product from the database cache.
- **Endpoint**: `DELETE /api/products/:barcode`
- **Example Request**:
  ```bash
  curl -X DELETE https://marocain-food-api.vercel.app/api/products/3017670149729
  ```

### 5. Trigger Scraper
Scrapes and imports Moroccan products directly into the database. (Supports pagination)
- **Endpoint**: `GET /api/scrape/moroccan?page=1&page_size=10`
- **Example Request**:
  ```bash
  curl "https://marocain-food-api.vercel.app/api/scrape/moroccan?page=1"
  ```

## Credits
- Made by [Zoubaa Mohammed](https://zoubaa.dev/)
