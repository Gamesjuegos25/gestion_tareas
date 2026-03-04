import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function exploreTareas() {
  const client = await pool.connect();
  try {
    // Obtener columnas
    const colRes = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'tareas'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Columnas de la tabla "tareas":\n');
    colRes.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Obtener primer registro
    const dataRes = await client.query('SELECT * FROM tareas LIMIT 1');
    
    if (dataRes.rows.length > 0) {
      console.log('\n📌 Primer registro de ejemplo:\n');
      console.log(JSON.stringify(dataRes.rows[0], null, 2));
    }
    
    // Contar registros
    const countRes = await client.query('SELECT COUNT(*) as total FROM tareas');
    console.log(`\n📊 Total de registros en tareas: ${countRes.rows[0].total}`);
    
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

exploreTareas();
