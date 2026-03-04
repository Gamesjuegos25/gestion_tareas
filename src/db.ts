import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.PGSSLMODE ? { rejectUnauthorized: false } : { rejectUnauthorized: false }
});

function isIdentifierSafe(s: string | undefined) {
  if (!s) return false;
  return /^[a-zA-Z0-9_]+$/.test(s);
}

export async function getTasksByStatus(statusName: string) {
  const sql = `
    SELECT t.id, t.titulo, t.descripcion
    FROM tareas t
    JOIN estados_tarea e ON t.estado_id = e.id
    WHERE LOWER(e.nombre) = LOWER($1)
    ORDER BY t.id LIMIT 100
  `;
  const client = await pool.connect();
  try {
    const res = await client.query(sql, [statusName]);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function getAvailableStatuses() {
  const sql = `SELECT DISTINCT nombre FROM estados_tarea ORDER BY nombre`;
  const client = await pool.connect();
  try {
    const res = await client.query(sql);
    return res.rows.map(row => row.nombre);
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
}
