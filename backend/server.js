// server.js
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define the /service/getAll endpoint
app.get('/service/getAll', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.service');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
