import React, { useState } from 'react';
import { createTask } from '../api/Tasks';

interface Props {
  // Le pasamos la nueva tarea al Tablero para que la dibuje al instante
  onCreated?: (tareaNueva: any) => void;
  // Recibimos la columna para saber dónde cayó el botón "+"
  columnaId?: number; 
}

export default function TaskForm({ onCreated, columnaId }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validar fecha: no puede ser anterior a hoy. (CÓDIGO ORIGINAL DEL COMPAÑERO)
    if (!dueDate) {
      setError('La fecha límite es obligatoria');
      return;
    }
    const [y, m, d] = dueDate.split('-').map(Number);
    const inputDateLocal = new Date(y, m - 1, d);
    const now = new Date();
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (inputDateLocal < todayLocal) {
      setError('La fecha límite no puede ser anterior a la fecha actual');
      return;
    }

    setLoading(true);
    try {
      // Mandamos el ID de la columna para que sepa dónde guardarla
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

  // JSX ORIGINAL ADAPTADO A TU DISEÑO
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'grid', gap: 12 }}>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Título</label>
        <input
          className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-gray-700 focus:outline-none focus:border-[#001529]"
          placeholder="Ej. Comprar café..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          onInvalid={(e) => e.currentTarget.setCustomValidity('El título es obligatorio')}
          onInput={(e) => e.currentTarget.setCustomValidity('')}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</label>
        <textarea
          className="w-full border-2 border-gray-100 p-3 rounded-xl font-medium text-gray-600 focus:outline-none focus:border-[#001529] resize-none"
          placeholder="Detalles de la tarea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          onInvalid={(e) => e.currentTarget.setCustomValidity('La descripción es obligatoria')}
          onInput={(e) => e.currentTarget.setCustomValidity('')}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fecha Límite</label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-gray-700 focus:outline-none focus:border-[#001529]"
        />
      </div>

      <button type="submit" disabled={loading} className="bg-[#001529] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform mt-2">
        {loading ? 'Creando...' : 'Crear Tarea'}
      </button>
      
      {error && <div style={{ color: 'crimson', fontWeight: 'bold', textAlign: 'center' }}>⚠️ {error}</div>}
    </form>
  );
}