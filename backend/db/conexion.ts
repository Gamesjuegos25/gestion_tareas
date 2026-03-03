import { Pool } from 'pg';

const pool = new Pool({
    host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
    port: 5432,
    database: 'gestion_tareas_v1kx',
    user: 'cris',
    password: '1234567',
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export const getClient = () => {
    return pool.connect();
};

export const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Database connection successful:', result.rows[0]);
        return true;
    } catch (err) {
        console.error('Database connection failed:', err);
        return false;
    }
};