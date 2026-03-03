import { useEffect, useState } from 'react';

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  dificultad: string;
  columna: string;
}

function TaskList({ refresh }: { refresh?: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Obtener tareas
  const fetchTasks = () => {
    fetch('http://localhost:3000/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  // Eliminar tarea
  const eliminarTarea = (id: number) => {
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetchTasks());
  };

  // Mover tarea entre columnas
  const moverColumna = (id: number, columna: string) => {
    fetch(`http://localhost:3000/tasks/${id}/columna`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columna }),
    }).then(() => fetchTasks());
  };

  // Renderizar columnas
  const columnas = ['Por hacer', 'En progreso', 'Hecho'];

  return (
    <div style={{ padding: '32px', background: '#f7f9fc', borderRadius: '16px', boxShadow: '0 2px 16px #0001', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'left', color: '#222', fontWeight: 800, fontSize: '2.2rem', marginBottom: '32px', letterSpacing: '-1px' }}>Lista de Tareas</h2>
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
        {columnas.map((col, idx) => (
          <div
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = Number(e.dataTransfer.getData('id'));
              moverColumna(id, col);
            }}
            style={{
              flex: 1,
              background: idx === 2 ? '#eafbe7' : idx === 1 ? '#eaf1fb' : '#f5f5fa',
              padding: '18px 12px',
              borderRadius: '14px',
              minHeight: '220px',
              boxShadow: '0 2px 8px #0001',
              transition: 'background 0.2s',
            }}
          >
            <h3 style={{ color: '#4f8cff', fontWeight: 700, fontSize: '1.3rem', marginBottom: '16px', letterSpacing: '-0.5px' }}>{col}</h3>
            {tasks.filter((t) => t.columna === col).length === 0 ? (
              <p style={{ color: '#bbb', fontWeight: 500, fontSize: '1.1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', padding: '24px 0', textAlign: 'center' }}>No hay tareas.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks.filter((t) => t.columna === col).map((task) => (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('id', String(task.id))}
                    style={{
                      marginBottom: '18px',
                      padding: '18px 16px',
                      border: '1px solid #e0e7ef',
                      borderRadius: '10px',
                      background: '#fff',
                      boxShadow: '0 2px 8px #0001',
                      transition: 'box-shadow 0.2s',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: '#222', fontWeight: 700, fontSize: '1.1rem' }}>{task.titulo}</h4>
                      <span style={{ fontSize: '0.95rem', color: '#4f8cff', fontWeight: 600 }}>{task.dificultad}</span>
                    </div>
                    <p style={{ margin: '8px 0 0 0', color: '#555', fontSize: '1rem' }}>{task.descripcion}</p>
                    <p style={{ margin: '8px 0 0 0', color: '#888', fontSize: '0.95rem' }}>Entrega: <b>{task.fechaEntrega}</b></p>
                    <button onClick={() => eliminarTarea(task.id)} style={{ position: 'absolute', top: '12px', right: '12px', background: '#ff4f4f', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 1px 4px #0002' }}>Eliminar</button>
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

export default TaskList;