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


app.get("/service/get/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received id:", id);
  try {
    const report = await pool.query(`
      SELECT * FROM public.service
      WHERE id = $1
    `, [parseInt(id)]);

    if (report.rows.length === 0) {satisfies
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(report.rows[0]);  // Return the first matching service
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Define the /service/getAll endpoint
app.get('/package/getAll', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.package');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//TODO: Cambiar el query para que reciba el id de paquete.
app.get("/package/getAllByServiceId/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const report = await pool.query(`
      SELECT * FROM public.package
      WHERE service_id = 5
    `);

    if (report.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(report.rows[0]);  // Return the first matching service
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
