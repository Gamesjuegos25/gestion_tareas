import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
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
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Fecha límite: {task.dueDate}</p>
              <p>Estado: {task.completed ? '✅ Completada' : '⏳ Pendiente'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;