import { useState } from 'react';

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id'>) => void;
  onCancel?: () => void;
}

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  dificultad: string;
  columna: string;
}

const defaultTask = {
  titulo: '',
  descripcion: '',
  fechaEntrega: '',
  dificultad: 'Fácil',
  columna: 'Por hacer',
};

function TaskForm({ onSave, onCancel }: TaskFormProps) {
  const [task, setTask] = useState<Omit<Task, 'id'>>(defaultTask);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.titulo.trim() || !task.fechaEntrega.trim()) {
      alert('Título y fecha de entrega son obligatorios');
      return;
    }
    onSave(task);
    setTask(defaultTask);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px', background: '#f9f9f9', borderRadius: '12px', padding: '24px 18px', boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '12px', fontWeight: 800 }}>Nueva Tarea</h2>
      <input
        name="titulo"
        value={task.titulo}
        onChange={handleChange}
        placeholder="Título"
        required
        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #90caf9', fontSize: '1rem', background: '#fff', color: '#222' }}
      />
      <input
        name="descripcion"
        value={task.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #90caf9', fontSize: '1rem', background: '#fff', color: '#222' }}
      />
      <input
        name="fechaEntrega"
        type="date"
        value={task.fechaEntrega}
        onChange={handleChange}
        required
        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #90caf9', fontSize: '1rem', background: '#fff', color: '#222' }}
      />
      <select
        name="dificultad"
        value={task.dificultad}
        onChange={handleChange}
        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #90caf9', fontSize: '1rem', background: '#fff', color: '#222' }}
      >
        <option value="Fácil">Fácil</option>
        <option value="Media">Media</option>
        <option value="Difícil">Difícil</option>
      </select>
      <select
        name="columna"
        value={task.columna}
        onChange={handleChange}
        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #90caf9', fontSize: '1rem', background: '#fff', color: '#222' }}
      >
        <option value="Por hacer">Por hacer</option>
        <option value="En progreso">En progreso</option>
        <option value="Terminada">Terminada</option>
      </select>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center' }}>
        <button type="submit" style={{ padding: '12px 28px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 1px 4px #0002' }}>
          Guardar
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '12px 28px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
