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

async function listTables() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Tablas encontradas en la base de datos:');
    console.log('==========================================\n');
    
    if (res.rows.length === 0) {
      console.log('No hay tablas públicas en la BD.');
      return;
    }
    
    res.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.table_name}`);
    });
    
    console.log('\n==========================================');
    console.log('Obtener columnas de una tabla específica:\n');
    
    // Mostrar columnas de la primera tabla encontrada
    const firstTable = res.rows[0].table_name;
    console.log(`Columnas de "${firstTable}":\n`);
    
    const colRes = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [firstTable]);
    
    colRes.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

listTables();
