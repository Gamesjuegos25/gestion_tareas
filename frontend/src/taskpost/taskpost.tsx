import { useEffect, useState } from 'react';

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  dificultad: string;
  columna: string;
}

function TaskPost() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = () => {
    fetch('http://localhost:3000/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const eliminarTarea = (id: number) => {
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetchTasks());
  };

  const moverColumna = (id: number, columna: string) => {
    fetch(`http://localhost:3000/tasks/${id}/columna`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columna }),
    }).then(() => fetchTasks());
  };

  const columnas = ['Por hacer', 'En progreso', 'Hecho'];

  return (
    <div style={{ padding: '20px' }}>
      <h1>TaskPost - Lista de Tareas</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {columnas.map((col) => (
          <div
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = Number(e.dataTransfer.getData('id'));
              moverColumna(id, col);
            }}
            style={{ flex: 1, background: '#f4f4f4', padding: '10px', borderRadius: '8px', minHeight: '200px' }}
          >
            <h2>{col}</h2>
            {tasks.filter((t) => t.columna === col).length === 0 ? (
              <p>No hay tareas.</p>
            ) : (
              <ul>
                {tasks.filter((t) => t.columna === col).map((task) => (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('id', String(task.id))}
                    style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', background: '#fff' }}
                  >
                    <h3>{task.titulo}</h3>
                    <p>{task.descripcion}</p>
                    <p>Fecha entrega: {task.fechaEntrega}</p>
                    <p>Dificultad: {task.dificultad}</p>
                    <button onClick={() => eliminarTarea(task.id)}>Eliminar</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskPost;
