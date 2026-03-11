import express from 'express';
import path from 'path';
import { listarTareas, eliminarTarea, obtenerTablas, obtenerRegistrosTabla, eliminarRegistroTabla } from './tareas';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API para obtener lista de tablas disponibles
app.get('/api/tablas', async (req, res) => {
  try {
    const tablas = await obtenerTablas();
    res.json(tablas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tablas' });
  }
});

// API para obtener registros de una tabla específica
app.get('/api/registros/:tabla', async (req, res) => {
  try {
    const tabla = req.params.tabla;
    const registros = await obtenerRegistrosTabla(tabla);
    res.json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

// API para eliminar registro de una tabla específica
app.delete('/api/registros/:tabla/:id', async (req, res) => {
  try {
    const tabla = req.params.tabla;
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const ok = await eliminarRegistroTabla(tabla, id);
    if (ok) return res.json({ success: true });
    return res.status(404).json({ error: 'registro no encontrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
});

// API para listar tareas (mantener para compatibilidad)
app.get('/api/tareas', async (req, res) => {
  try {
    const tareas = await listarTareas();
    res.json(tareas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar tareas' });
  }
});

// API para eliminar tarea (mantener para compatibilidad)
app.delete('/api/tareas/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const ok = await eliminarTarea(id);
    if (ok) return res.json({ success: true });
    return res.status(404).json({ error: 'tarea no encontrada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🎉 Servidor iniciado en http://localhost:${port}`);
  console.log(`📝 Abre http://localhost:${port} para eliminar datos`);
});
