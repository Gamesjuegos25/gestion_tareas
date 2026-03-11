const { Pool } = require('pg');
(async () => {
  const pool = new Pool({
    host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
    port: 5432,
    database: 'gestion_tareas_v1kx',
    user: 'pedro',
    password: '1234',
    ssl: { rejectUnauthorized: false }
  });
  try {
    const res = await pool.query('SELECT * FROM tareas ORDER BY id');
    console.log('📝 TAREAS INSERTADAS:');
    console.table(res.rows);
  } catch (err) {
    console.error('Error query:', err.message);
  } finally {
    await pool.end();
  }
})();
