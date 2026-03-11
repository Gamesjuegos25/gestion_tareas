import { useState } from 'react';
import TaskForm from './components/TaskForm';

function TaskList() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Crear Tarea</h1>

      <TaskForm
        onCreated={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
      />

      {saved && <div style={{ color: 'green', marginTop: 12 }}>Tarea creada correctamente.</div>}
    </div>
  );
}

export default TaskList;