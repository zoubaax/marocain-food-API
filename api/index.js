const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/db');
const productsRouter = require('./routes/products');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database connection and schema
initDb();

// Mount all modular endpoints (including docs page)
app.use('/', productsRouter);

// Port initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
