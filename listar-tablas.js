const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
  port: 5432,
  database: 'gestion_tareas_v1kx',
  user: 'pedro',
  password: '1234',
  ssl: { rejectUnauthorized: false }
});

async function listarTablas() {
  try {
    console.log('\n📊 TABLAS EN LA BASE DE DATOS:\n');
    
    const resultado = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );

    if (resultado.rows.length === 0) {
      console.log('  ❌ No se encontraron tablas');
    } else {
      resultado.rows.forEach(row => {
        console.log(`  📋 ${row.table_name}`);
      });
    }

    // Ahora mostrar detalles de cada tabla
    for (const row of resultado.rows) {
      const tabla = row.table_name;
      const columnas = await pool.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='${tabla}' ORDER BY ordinal_position`
      );

      console.log(`\n  └─ Columnas de "${tabla}":`);
      columnas.rows.forEach(col => {
        console.log(`     • ${col.column_name} (${col.data_type})`);
      });
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

listarTablas();
