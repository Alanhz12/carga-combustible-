const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Rutas para empleados
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { name, dni, license, phone } = req.body;
    const result = await pool.query(
      'INSERT INTO employees (name, dni, license, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, dni, license, phone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar empleado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas para vehículos
app.get('/api/vehicles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY brand');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const { patent, brand, model, year, type } = req.body;
    const result = await pool.query(
      'INSERT INTO vehicles (patent, brand, model, year, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patent, brand, model, year, type]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar vehículo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
    res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas para vales
app.get('/api/vouchers', async (req, res) => {
  try {
    const { dateFrom, dateTo, driver, vehicle } = req.query;
    let query = `
      SELECT v.*, e.name as driver_name, ve.patent, ve.brand, ve.model 
      FROM vouchers v
      LEFT JOIN employees e ON v.driver_id = e.id
      LEFT JOIN vehicles ve ON v.vehicle_id = ve.id
    `;
    let conditions = [];
    let params = [];
    let paramCount = 0;

    if (dateFrom) {
      paramCount++;
      conditions.push(`v.date >= $${paramCount}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      paramCount++;
      conditions.push(`v.date <= $${paramCount}`);
      params.push(dateTo);
    }

    if (driver) {
      paramCount++;
      conditions.push(`v.driver_id = $${paramCount}`);
      params.push(driver);
    }

    if (vehicle) {
      paramCount++;
      conditions.push(`v.vehicle_id = $${paramCount}`);
      params.push(vehicle);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY v.date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vales:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/vouchers', async (req, res) => {
  try {
    const { voucher_number, driver_id, vehicle_id, fuel_type, amount, station, observations, price_per_liter, date, signature } = req.body;
    const result = await pool.query(
      `INSERT INTO vouchers (voucher_number, driver_id, vehicle_id, fuel_type, amount, station, observations, price_per_liter, date, signature) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [voucher_number, driver_id, vehicle_id, fuel_type, amount, station, observations, price_per_liter, date, signature]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar vale:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/vouchers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM vouchers WHERE id = $1', [id]);
    res.json({ message: 'Vale eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar vale:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas para precios de combustible
app.get('/api/fuel-prices/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fuel_prices ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error al obtener precios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/fuel-prices', async (req, res) => {
  try {
    const { diesel, diesel_premium, nafta_super, nafta_premium, gnc } = req.body;
    const result = await pool.query(
      `INSERT INTO fuel_prices (diesel, diesel_premium, nafta_super, nafta_premium, gnc) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [diesel, diesel_premium, nafta_super, nafta_premium, gnc]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar precios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/fuel-prices/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fuel_prices ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener historial de precios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta principal para servir la aplicación
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});