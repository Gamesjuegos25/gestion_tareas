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

    // Crear tabla si no existe
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS tareas (
          id SERIAL PRIMARY KEY,
          descripcion VARCHAR(255) NOT NULL,
          estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente'
        )
      `);
      console.log("✅ Tabla 'tareas' lista");
    } catch (tableError: any) {
      if (tableError.code === '42501') {
        console.log("⚠️ Usando tabla 'tareas' existente (permisos limitados)");
      } else {
        console.log("⚠️ Advertencia al crear tabla:", tableError.message);
      }
    }

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
