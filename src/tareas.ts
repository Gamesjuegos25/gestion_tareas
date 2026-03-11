import { getPool } from "./database";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estado_id: string;
  fecha_limite: Date;
  creado_en: Date;
  actualizado_en: Date;
}

export async function buscarTareas(keyword: string): Promise<Tarea[]> {
  try {
    const pool = getPool();
    const resultado = await pool.query(
      "SELECT * FROM tareas WHERE titulo ILIKE $1 OR descripcion ILIKE $1 ORDER BY creado_en DESC",
      [`%${keyword}%`]
    );
    if (resultado.rows.length === 0) {
      console.log("🔍 No se encontraron tareas con esa palabra clave.");
    }
    return resultado.rows;
  } catch (error) {
    console.error("Error al buscar tareas:", error);
    return [];
  }
}

export async function agregarTarea(titulo: string, descripcion?: string): Promise<Tarea | null> {
  try {
    const pool = getPool();
    // Fecha límite por defecto: mañana a las 18:00
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 1);
    fechaLimite.setHours(18, 0, 0, 0);

    const resultado = await pool.query(
      "INSERT INTO tareas (titulo, descripcion, estado_id, fecha_limite) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, descripcion || titulo, 1, fechaLimite]
    );
    return resultado.rows[0];
  } catch (error) {
    console.error("Error al agregar tarea:", error);
    return null;
  }
}

export async function toggleTarea(id: string | number): Promise<Tarea | null> {
  try {
    const pool = getPool();
    // Cambiar estado entre 1 y 2
    const resultado = await pool.query(
      "UPDATE tareas SET estado_id = CASE WHEN estado_id = 1 THEN 2 ELSE 1 END WHERE id = $1 RETURNING *",
      [id]
    );
    if (resultado.rows.length === 0) return null;
    return resultado.rows[0];
  } catch (error) {
    console.error("Error al cambiar estado de tarea:", error);
    return null;
  }
}

export async function listarTareas(): Promise<Tarea[]> {
  try {
    const pool = getPool();
    const resultado = await pool.query("SELECT * FROM tareas ORDER BY creado_en DESC");
    return resultado.rows;
  } catch (error) {
    console.error("Error al listar tareas:", error);
    return [];
  }
}
