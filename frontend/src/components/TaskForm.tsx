import React, { useState } from 'react';
import { createTask } from '../api/tasks';

interface Props {
  onCreated?: () => void;
}

export default function TaskForm({ onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validar fecha: no puede ser anterior a hoy.
    // Comparar solo año/mes/día para evitar problemas de zona horaria.
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
      // Enviar estado por defecto 'Pendiente' explicitamente
      await createTask({ title, description, dueDate, estado: 'Pendiente' });
      setTitle('');
      setDescription('');
      setDueDate('');
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || 'Error creando tarea');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'grid', gap: 8 }}>
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('El título es obligatorio')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
      />
      <input
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('La descripción es obligatoria')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
      />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Tarea'}</button>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </form>
  );
}
