import pool from './db';

export type Estado = string;

export interface Tarea {
  id: number;
  descripcion: string;
  estado?: Estado;
}

export interface Tabla {
  nombre: string;
  cantidad: number;
}

function mapEstado(estadoId: any): string {
  // Si ya es string, devolverlo tal cual
  if (typeof estadoId === 'string') {
    const estadoMapStr: { [key: string]: string } = {
      'pendiente': 'pendiente',
      'en_progreso': 'en progreso',
      'completada': 'completada',
      'Pendiente': 'Pendiente',
      'Terminada': 'Terminada',
      'Por hacer': 'Por hacer'
    };
    return estadoMapStr[estadoId] || estadoId;
  }
  
  // Si es número, mapear a palabra
  if (typeof estadoId === 'number' || !isNaN(parseInt(estadoId))) {
    const num = parseInt(estadoId);
    const estadoMap: { [key: number]: string } = {
      1: 'pendiente',
      2: 'en progreso',
      3: 'completada',
      7: 'Pendiente',
      8: 'Terminada',
      9: 'Por hacer'
    };
    return estadoMap[num] || `Estado ${num}`;
  }
  
  return 'Desconocido';
}

function mapRow(row: any): Tarea {
  const estado = row.estado_id ? mapEstado(row.estado_id) : (row.estado ? row.estado : undefined);
  return { id: Number(row.id), descripcion: row.descripcion, estado };
}

// Obtener lista de todas las tablas user-defined
export async function obtenerTablas(): Promise<Tabla[]> {
  try {
    const res = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tablas: Tabla[] = [];
    for (const row of res.rows) {
      const tableName = row.table_name;
      const countRes = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
      tablas.push({
        nombre: tableName,
        cantidad: Number(countRes.rows[0].count)
      });
    }
    return tablas;
  } catch (err) {
    console.error('Error al obtener tablas:', err);
    return [];
  }
}

// Obtener registros de una tabla específica
export async function obtenerRegistrosTabla(tableName: string): Promise<Tarea[]> {
  try {
    if (!tableName.match(/^[a-zA-Z0-9_]+$/)) {
      throw new Error('Nombre de tabla inválido');
    }
    
    const res = await pool.query(`
      SELECT * FROM ${tableName} LIMIT 1000
    `);
    
    if (res.rows.length === 0) return [];
    
    // Detectar columnas de id y descripción
    const firstRow = res.rows[0];
    const columnas = Object.keys(firstRow);
    const idCol = columnas.find(col => col === 'id' || col.endsWith('_id'));
    const descCol = columnas.find(col => col === 'descripcion' || col === 'nombre' || col === 'title' || col === 'name');
    
    if (!idCol) return [];
    
    return res.rows.map((row: any) => {
      let estado: string | undefined = undefined;
      // Buscar columna de estado
      const estadoCol = columnas.find(col => col === 'estado' || col === 'estado_id' || col === 'status');
      if (estadoCol) {
        estado = mapEstado(row[estadoCol]);
      }
      return {
        id: Number(row[idCol!]),
        descripcion: row[descCol!] || `Registro #${row[idCol!]}`,
        estado
      };
    });
  } catch (err) {
    console.error('Error al obtener registros:', err);
    return [];
  }
}

// Eliminar registro de una tabla específica
export async function eliminarRegistroTabla(tableName: string, id: number): Promise<boolean> {
  try {
    if (!tableName.match(/^[a-zA-Z0-9_]+$/)) {
      throw new Error('Nombre de tabla inválido');
    }
    
    const res = await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  } catch (err) {
    console.error('Error al eliminar registro:', err);
    return false;
  }
}

export async function obtenerTareaPorId(id: number): Promise<Tarea | undefined> {
  const res = await pool.query(
    'SELECT id, descripcion, estado_id FROM tareas WHERE id = $1',
    [id]
  );
  if (res.rows.length === 0) return undefined;
  return mapRow(res.rows[0]);
}

export async function eliminarTarea(id: number): Promise<boolean> {
  const res = await pool.query('DELETE FROM tareas WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function listarTareas(): Promise<Tarea[]> {
  const res = await pool.query('SELECT id, descripcion, estado_id FROM tareas ORDER BY id');
  return res.rows.map(mapRow);
}
