function getDocsHtml() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Food Cache API - Documentation</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-main: #0b0f19;
          --bg-card: #151d30;
          --bg-input: #1e293b;
          --border: rgba(255, 255, 255, 0.08);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --accent-green: #10b981;
          --accent-blue: #3b82f6;
          --accent-purple: #8b5cf6;
          --accent-red: #f43f5e;
          --accent-orange: #f59e0b;
          --neon-glow: rgba(59, 130, 246, 0.12);
          --radius: 12px;
          --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Outfit', sans-serif;
          background-color: var(--bg-main);
          color: var(--text-main);
          line-height: 1.6;
          padding: 2rem 1.5rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        header::after {
          content: '';
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, var(--neon-glow) 0%, transparent 70%);
          z-index: -1;
          pointer-events: none;
        }

        h1 {
          font-size: 3.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.75rem;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto 1.75rem auto;
          font-weight: 300;
        }

        .badge-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .badge {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .badge-live {
          color: var(--accent-green);
          border-color: rgba(16, 185, 129, 0.25);
          background-color: rgba(16, 185, 129, 0.04);
        }

        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-green);
          animation: pulse 1.8s infinite;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: 1.3fr 1fr;
          }
        }

        .section-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
          border-left: 4px solid var(--accent-blue);
          padding-left: 0.75rem;
        }

        .card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 2rem;
          margin-bottom: 1.75rem;
          transition: var(--transition);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .card:hover {
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25);
        }

        .endpoint-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .endpoint-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .method {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .method.get {
          background-color: rgba(59, 130, 246, 0.08);
          color: var(--accent-blue);
          border: 1px solid rgba(59, 130, 246, 0.15);
        }

        .method.patch {
          background-color: rgba(139, 92, 246, 0.08);
          color: var(--accent-purple);
          border: 1px solid rgba(139, 92, 246, 0.15);
        }

        .method.delete {
          background-color: rgba(244, 63, 94, 0.08);
          color: var(--accent-red);
          border: 1px solid rgba(244, 63, 94, 0.15);
        }

        .path {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--text-main);
          word-break: break-all;
        }

        .description {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-size: 0.98rem;
        }

        .playground-title {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 640px) {
          .input-group-row {
            flex-direction: row;
          }
        }

        input {
          flex: 1;
          background-color: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: var(--transition);
        }

        input:focus {
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        button {
          background-color: var(--accent-blue);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        button:hover {
          background-color: #2563eb;
        }

        button:active {
          transform: translateY(1px);
        }

        .code-block-container {
          position: relative;
        }

        .code-block {
          background-color: #080c14;
          border-radius: 8px;
          padding: 1.25rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          overflow-x: auto;
          border: 1px solid var(--border);
          max-height: 380px;
        }

        .btn-copy {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 0.35rem 0.65rem;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-copy:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }

        .params-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0 1.5rem 0;
          font-size: 0.9rem;
        }

        .params-table th, .params-table td {
          text-align: left;
          padding: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .params-table th {
          color: var(--text-muted);
          font-weight: 600;
          background: rgba(255, 255, 255, 0.01);
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

        /* Product Visualizer styles */
        .product-visual {
          margin-top: 1.5rem;
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .product-visual {
            flex-direction: row;
          }
        }

        .product-img-box {
          width: 100%;
          max-width: 120px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin: 0 auto;
        }

        .product-img-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .product-details {
          flex: 1;
        }

        .product-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        @media (min-width: 640px) {
          .product-title {
            text-align: left;
          }
        }

        .nutri-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        @media (min-width: 480px) {
          .nutri-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .nutri-tag {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
        }

        .nutri-label {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .nutri-value {
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          color: var(--text-main);
        }

        .scraped-list-preview {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 250px;
          overflow-y: auto;
        }

        .scraped-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .scraped-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 4px;
          background: white;
          padding: 2px;
        }

        .scraped-info {
          flex: 1;
          min-width: 0;
        }

        .scraped-name {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .scraped-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        footer {
          text-align: center;
          margin-top: 6rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          border-top: 1px solid var(--border);
          padding: 2.5rem 0;
        }

        footer a {
          color: var(--accent-blue);
          text-decoration: none;
        }

        footer a:hover {
          text-decoration: underline;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
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
              <span class="pulse-dot"></span>
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
                <div class="endpoint-title-group">
                  <span class="method get">GET</span>
                  <span class="path">/api/products</span>
                </div>
              </div>
              <p class="description">Retrieve all product details cached inside your custom Neon database.</p>
              <div class="playground-title">Code Example (Fetch)</div>
              <div class="code-block-container">
                <button class="btn-copy" onclick="copyText('fetch-all-code')">Copy</button>
                <div class="code-block">
                  <pre id="fetch-all-code">fetch('/api/products')\n  .then(res => res.json())\n  .then(data => console.log(data));</pre>
                </div>
              </div>
            </div>

            <!-- GET ONE -->
            <div class="card">
              <div class="endpoint-header">
                <div class="endpoint-title-group">
                  <span class="method get">GET</span>
                  <span class="path">/api/products/:barcode</span>
                </div>
              </div>
              <p class="description">Queries your Neon cache database first. If not found, requests product data from Open Food Facts, formats/caches name, barcode, custom image and nutrition facts, and returns it.</p>
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
              <div class="code-block-container">
                <button class="btn-copy" onclick="copyText('fetch-one-code')">Copy</button>
                <div class="code-block">
                  <pre id="fetch-one-code">fetch('/api/products/3017670149729')\n  .then(res => res.json())\n  .then(data => console.log(data));</pre>
                </div>
              </div>
            </div>

            <!-- SCRAPE MOROCCAN -->
            <div class="card">
              <div class="endpoint-header">
                <div class="endpoint-title-group">
                  <span class="method get" style="background-color: rgba(16, 185, 129, 0.08); color: var(--accent-green); border: 1px solid rgba(16, 185, 129, 0.15);">GET</span>
                  <span class="path">/api/scrape/moroccan</span>
                </div>
              </div>
              <p class="description">Scrape and automatically cache Moroccan products from Open Food Facts into your database.</p>
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Query Parameter</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="param-name">page</td>
                    <td class="param-type">number</td>
                    <td>No</td>
                    <td>Page number to fetch (default: <code>1</code>)</td>
                  </tr>
                  <tr>
                    <td class="param-name">page_size</td>
                    <td class="param-type">number</td>
                    <td>No</td>
                    <td>Products per page (default: <code>50</code>)</td>
                  </tr>
                </tbody>
              </table>
              <div class="playground-title">Code Example (Fetch)</div>
              <div class="code-block-container">
                <button class="btn-copy" onclick="copyText('fetch-scrape-code')">Copy</button>
                <div class="code-block">
                  <pre id="fetch-scrape-code">fetch('/api/scrape/moroccan?page=1&page_size=10')\n  .then(res => res.json())\n  .then(data => console.log(data));</pre>
                </div>
              </div>
            </div>

            <!-- PATCH UPDATE -->
            <div class="card">
              <div class="endpoint-header">
                <div class="endpoint-title-group">
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
              <div class="code-block-container">
                <button class="btn-copy" onclick="copyText('patch-body-code')">Copy</button>
                <div class="code-block">
                  <pre id="patch-body-code">{\n  "name": "Super Nutella Custom",\n  "image_url": "https://images.unsplash.com/photo-1541658016709-82535e94bc69"\n}</pre>
                </div>
              </div>
            </div>

            <!-- DELETE -->
            <div class="card">
              <div class="endpoint-header">
                <div class="endpoint-title-group">
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
              <p class="description" style="margin-bottom: 1.25rem;">Test the API directly in your browser. Enter parameters below to query live.</p>
              
              <!-- Action 1: Scrape -->
              <div class="playground-title">1. Scrape Moroccan Products (Import)</div>
              <div class="input-group input-group-row">
                <input type="number" id="scrape-page" placeholder="Page" value="1">
                <button onclick="testScrape()" style="background-color: var(--accent-green);">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  Scrape & Import
                </button>
              </div>

              <!-- Action 2: Get One -->
              <div class="playground-title">2. Fetch Product (from Cache/API)</div>
              <div class="input-group input-group-row">
                <input type="text" id="barcode-input" placeholder="e.g. 3017670149729" value="3017670149729">
                <button onclick="testFetch()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Send Request
                </button>
              </div>

              <!-- Action 3: Patch Custom Details -->
              <div id="patch-section" style="display: none; margin-top: 1rem; border-top: 1px dashed var(--border); padding-top: 1rem;">
                <div class="playground-title">3. Customize Image/Name</div>
                <div class="input-group">
                  <input type="text" id="patch-name" placeholder="Custom Product Name">
                  <input type="text" id="patch-image" placeholder="Custom Image URL">
                  <button onclick="testPatch()" style="background-color: var(--accent-purple); align-self: flex-start;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/></svg>
                    Update Product
                  </button>
                </div>
              </div>

              <!-- Visual Rendering Output -->
              <div id="visual-preview-container" style="display: none;">
                <div class="playground-title">Visual Product Preview</div>
                <div id="visual-output" class="card" style="margin-bottom: 1.25rem; padding: 1.25rem; background-color: rgba(255, 255, 255, 0.02);">
                  <!-- Dynamic product details go here -->
                </div>
              </div>

              <!-- Raw Response Output -->
              <div class="playground-title">Response JSON</div>
              <div class="code-block-container">
                <button class="btn-copy" onclick="copyText('response-output')">Copy</button>
                <div class="code-block" style="background-color: #06090f;">
                  <pre id="response-output">// Click an action above to see results...</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <p>Powered by <a href="https://world.openfoodfacts.org/" target="_blank">Open Food Facts Data</a> and <a href="https://neon.tech" target="_blank">Neon PostgreSQL</a>.</p>
        </footer>
      </div>

      <script>
        // Copy to clipboard helper
        function copyText(elementId) {
          const text = document.getElementById(elementId).textContent;
          navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
              btn.textContent = originalText;
            }, 1500);
          });
        }

        // Render nutritional tags helper
        function renderNutrition(nutri) {
          if (!nutri) return '';
          const labels = {
            energy_kcal_100g: 'Energy',
            fat_100g: 'Fat',
            saturated_fat_100g: 'Sat. Fat',
            carbohydrates_100g: 'Carbs',
            sugars_100g: 'Sugars',
            proteins_100g: 'Proteins',
            salt_100g: 'Salt'
          };
          
          let html = '<div class="nutri-grid">';
          for (const [key, value] of Object.entries(labels)) {
            const val = nutri[key];
            const suffix = key.startsWith('energy') ? ' kcal' : ' g';
            html += \`
              <div class="nutri-tag">
                <span class="nutri-label">\${value}</span>
                <span class="nutri-value">\${val !== null && val !== undefined ? val + suffix : 'N/A'}</span>
              </div>
            \`;
          }
          html += '</div>';
          return html;
        }

        async function testScrape() {
          const page = document.getElementById('scrape-page').value.trim() || 1;
          const output = document.getElementById('response-output');
          const visualContainer = document.getElementById('visual-preview-container');
          const visualOutput = document.getElementById('visual-output');
          
          visualContainer.style.display = 'none';
          output.textContent = '// Scraping page ' + page + '... This may take a few seconds.';
          
          try {
            const res = await fetch(\`/api/scrape/moroccan?page=\${page}&page_size=10\`);
            const data = await res.json();
            output.textContent = JSON.stringify(data, null, 2);

            if (data.success && data.products && data.products.length > 0) {
              visualContainer.style.display = 'block';
              let listHtml = \`
                <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--accent-green);">
                  Successfully Imported \${data.total_imported} Products:
                </div>
                <div class="scraped-list-preview">
              \`;
              data.products.forEach(p => {
                const img = p.image_url || 'https://images.openfoodfacts.org/images/icons/dist/packaging.svg';
                listHtml += \`
                  <div class="scraped-item">
                    <img class="scraped-img" src="\${img}" alt="product logo" onerror="this.src='https://images.openfoodfacts.org/images/icons/dist/packaging.svg'">
                    <div class="scraped-info">
                      <div class="scraped-name">\${p.name}</div>
                      <div class="scraped-code">Barcode: \${p.barcode}</div>
                    </div>
                  </div>
                \`;
              });
              listHtml += '</div>';
              visualOutput.innerHTML = listHtml;
            }
          } catch (err) {
            output.textContent = '// Error: ' + err.message;
          }
        }

        async function testFetch() {
          const barcode = document.getElementById('barcode-input').value.trim();
          const output = document.getElementById('response-output');
          const visualContainer = document.getElementById('visual-preview-container');
          const visualOutput = document.getElementById('visual-output');
          const patchSection = document.getElementById('patch-section');

          if (!barcode) {
            output.textContent = '// Please enter a barcode.';
            return;
          }
          output.textContent = '// Fetching product...';
          try {
            const res = await fetch(\`/api/products/\${barcode}\`);
            const data = await res.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.product) {
              const p = data.product;
              // Display PATCH settings
              patchSection.style.display = 'block';
              document.getElementById('patch-name').value = p.name || '';
              document.getElementById('patch-image').value = p.image_url || '';

              // Render visual product preview
              visualContainer.style.display = 'block';
              const img = p.image_url || 'https://images.openfoodfacts.org/images/icons/dist/packaging.svg';
              visualOutput.innerHTML = \`
                <div class="product-visual">
                  <div class="product-img-box">
                    <img src="\${img}" alt="product image" onerror="this.src='https://images.openfoodfacts.org/images/icons/dist/packaging.svg'">
                  </div>
                  <div class="product-details">
                    <div class="product-title">\${p.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem; font-family: 'JetBrains Mono', monospace;">
                      Barcode: \${p.barcode}
                    </div>
                    \${renderNutrition(p.nutrition_facts)}
                  </div>
                </div>
              \`;
            } else {
              visualContainer.style.display = 'none';
              patchSection.style.display = 'none';
            }
          } catch (err) {
            output.textContent = '// Error: ' + err.message;
            visualContainer.style.display = 'none';
            patchSection.style.display = 'none';
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
            
            // Re-fetch visual update
            if (data.product) {
              testFetch();
            }
          } catch (err) {
            output.textContent = '// Error: ' + err.message;
          }
        }
      </script>
    </body>
    </html>
  `;
}

module.exports = {
  getDocsHtml
};
