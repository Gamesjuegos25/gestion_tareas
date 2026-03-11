import { Pool } from "pg";

const pool = new Pool({
  host: "dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com",
  port: 5432,
  database: "gestion_tareas_v1kx",
  user: "pedro",
  password: "1234",
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Error en el pool de conexión:", err);
});

export async function inicializarDB() {
  try {
    const client = await pool.connect();
    console.log("✅ Conexión a la base de datos exitosa");

    // No creamos tablas aquí; asumimos que el esquema ya existe en el servidor.
    // Si necesitas ejecutar migraciones, hazlo de forma separada.

    client.release();
  } catch (error) {
    console.error("❌ Error crítico de conexión:", error);
    throw error;
  }
}

export function getPool() {
  return pool;
}

export async function cerrarConexion() {
  await pool.end();
}
