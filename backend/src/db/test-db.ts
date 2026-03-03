import { pool } from './conexion';

async function insertarYConsultar() {


  try {
    // Consultar todas las tareas
    const resultado = await pool.query('SELECT * FROM tareas');
    console.log('Todas las tareas:', resultado.rows);
    console.log('Títulos de las tareas:');
    resultado.rows.forEach(tarea => console.log('-', tarea.titulo));
  } catch (err) {
    if (err.code === 'ECONNRESET') {
      console.error('Error de conexión con la base de datos al consultar (Render puede estar inactivo o reiniciando). Intenta de nuevo en unos segundos.');
    } else {
      console.error('Error al consultar las tareas:', err);
    }
  }
}

insertarYConsultar();
