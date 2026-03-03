import { useEffect, useState } from 'react';

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_limite: string;
  estado_id: number;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Tareas</h1>
      {tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h3>{task.titulo}</h3>
              <p>{task.descripcion}</p>
              <p>Fecha límite: {task.fecha_limite?.split('T')[0]}</p>
              <p>Estado: {task.estado_id === 1 ? '⏳ Pendiente' : '✅ Completada'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;