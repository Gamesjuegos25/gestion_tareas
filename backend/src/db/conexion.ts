import { Pool } from 'pg';

// Conexión a base de datos PostgreSQL en Render
export const pool = new Pool({
    host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
    port: 5432,
    database: 'gestion_tareas_v1kx',
    user: 'cris',
    password: '1234567',
    ssl: { rejectUnauthorized: false }
});

// Función para validar la conexión
export async function validarConexion(): Promise<boolean> {
    try {
        await pool.query('SELECT 1');
        console.log('Conexión exitosa a la base de datos Render.');
        return true;
    } catch (err) {
        console.error('Error de conexión a la base de datos:', err);
        return false;
    }
}