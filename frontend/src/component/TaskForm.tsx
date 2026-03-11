import React, { useState, type FC } from 'react';
import { createTask } from '../api/Tasks';

interface Props {
  onCreated?: (tareaNueva: any) => void;
  columnaId?: number; 
}

// CAMBIO: Definimos el componente usando la constante de tipo FC
const TaskForm: FC<Props> = ({ onCreated, columnaId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!dueDate) {
      setError('La fecha límite es obligatoria');
      return;
    }
    
    const [y, m, d] = dueDate.split('-').map(Number);
    const inputDateLocal = new Date(y, m - 1, d);
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (inputDateLocal < todayLocal) {
      setError('La fecha no puede ser anterior a hoy');
      return;
    }

    setLoading(true);
    try {
      const estadoFinal = columnaId ? String(columnaId) : '1';
      const newTask = await createTask({ title, description, dueDate, estado: estadoFinal });
      
      setTitle('');
      setDescription('');
      setDueDate('');
      onCreated?.(newTask);
    } catch (err: any) {
      setError(err?.message || 'Error creando tarea');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-full overflow-x-hidden">
      <div className="space-y-1">
        <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Título de la Tarea</label>
        <input
          className="w-full border-3 border-brand-dark p-3.5 rounded-2xl font-galilea font-tarea-bold text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors placeholder:text-brand-gray/50 shadow-sm"
          placeholder="Ej. Comprar café..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          onInvalid={(e) => e.currentTarget.setCustomValidity('El título es obligatorio')}
          onInput={(e) => e.currentTarget.setCustomValidity('')}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Descripción</label>
        <textarea
          className="w-full border-3 border-brand-dark p-3.5 rounded-2xl font-galilea font-horario-reg text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors resize-none placeholder:text-brand-gray/50 shadow-sm"
          placeholder="Detalles de la tarea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          onInvalid={(e) => e.currentTarget.setCustomValidity('La descripción es obligatoria')}
          onInput={(e) => e.currentTarget.setCustomValidity('')}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Fecha Límite</label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          className="w-full border-3 border-brand-dark p-3.5 rounded-2xl font-titan text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm"
        />
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-brand-dark text-brand-white py-4 rounded-full font-titan text-xl shadow-[5px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-yellow hover:text-brand-dark hover:scale-[1.02] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 border-2 border-brand-dark uppercase tracking-wide"
        >
          {loading ? 'Procesando...' : 'Crear Tarea'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-2 border-red-500 text-red-600 p-3 rounded-xl font-galilea font-tarea-bold text-sm text-center animate-bounce">
          ⚠️ {error}
        </div>
      )}
    </form>
  );
}

export default TaskForm; // CAMBIO: Exportamos al final