import { Pool } from 'pg';

const user = process.env.DB_USER || 'pedro';
const password = process.env.DB_PASSWORD || '1234';
const host = process.env.DB_HOST || 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com';
const port = process.env.DB_PORT || '5432';
const database = process.env.DB_NAME || 'gestion_tareas_v1kx';

const connectionString = process.env.DATABASE_URL ||
  `postgres://${user}:${password}@${host}:${port}/${database}`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export default pool;
