const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

const pool = new Pool({
  host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
  port: 5432,
  database: 'gestion_tareas_v1kx',
  user: 'pedro',
  password: '1234',
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET - Listar todas las tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tareas ORDER BY creado_en DESC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener datos de cualquier tabla
app.get('/api/tabla/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    // Lista blanca de tablas permitidas
    const tablasPermitidas = ['tareas', 'estados_tarea', 'flujo_tareas', 'horarios', 'miembros', 'prioridades', 'proyectos'];
    
    if (!tablasPermitidas.includes(nombre)) {
      return res.status(400).json({ error: 'Tabla no válida' });
    }

    const resultado = await pool.query(`SELECT * FROM ${nombre} LIMIT 100`);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Abre tu navegador y ve a http://localhost:${PORT}\n`);
});
