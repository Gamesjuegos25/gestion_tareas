import React, { useState, type FC } from 'react';
import { createTask } from '../api/tasks';

interface Props {
  onCreated?: (tareaNueva: any) => void;
  columnaId?: number; 
}

const TaskForm: FC<Props> = ({ onCreated, columnaId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // --------------modificacion Lógica de fecha y hora por defecto en base a pc ------------------
  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const formatTime = (d: Date) => {
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${min}`;
  };
  const addHours = (d: Date, hours: number) => new Date(d.getTime() + hours * 60 * 60 * 1000);

  const hora_actual = new Date();
  const initialDate = formatDate(hora_actual);
  const initialHoraInicio = formatTime(hora_actual);
  // Si sumar una hora cruza a otro día, fijamos la hora de fin a 23:59
  const tempInitialFin = addHours(hora_actual, 1);
  const initialHoraFin = tempInitialFin.getDate() !== hora_actual.getDate()
    ? '23:59'
    : formatTime(tempInitialFin); // para que termine e una hora despues VALOR MODIFICABLE

  const [dueDate, setDueDate] = useState(() => initialDate);
  const [horaInicio, setHoraInicio] = useState(() => initialHoraInicio); // <-- ESTADO HORA INICIO
  const [horaFin, setHoraFin] = useState(() => initialHoraFin);       // <-- ESTADO HORA FIN
  // ------------------ fin de modificacion Lógica 
  

  const [prioridadId, setPrioridadId] = useState('2');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const tituloLimpio = title.trim();
    const descLimpia = description.trim();

    if (!tituloLimpio) { setError('El título no puede estar vacío.'); return; }
    if (!descLimpia) { setError('La descripción no puede estar vacía.'); return; }

    // -----modificacion Bloquear guiones y otros símbolos no permitidos en la descripción
    // No permitir que la descripción empiece con número o símbolo; debe empezar por letra
    const descripcionPermitida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ][A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-\.,:;?()]*$/;
    if (!descripcionPermitida.test(descLimpia)) {
      setError('La descripción debe empezar con una letra; no puede comenzar con número ni símbolo');
      return;
     // ------------------ 
    }
    if (!dueDate) { setError('La fecha límite es obligatoria'); return; }

    const tieneTextoValido = /[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/;
    if (!tieneTextoValido.test(tituloLimpio)) { setError('El título no puede contener solo símbolos.'); return; }
    
    // Validar Fechas en el pasado
    const [y, m, d] = dueDate.split('-').map(Number);
    const inputDateLocal = new Date(y, m - 1, d);
    const now = new Date();
    const nowRounded = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (inputDateLocal < todayLocal) {
      setError('La fecha no puede ser anterior a hoy');
      return;
    }

    // --- modificacion Validacion que la hora de inicio no sea mayor a la hora de fin y que no sean iguales
    // Evitar que la hora de fin sea 00:00 o supere 23:59 (eso correspondería al día siguiente)
    if (horaFin === '00:00') {
      setError('La hora de fin no puede ser doce AM  (sería del día siguiente).');
      return;
    }
    if (horaFin > '23:59') {
      setError('La hora de fin no puede ser mayor a 23:59.');
      return;
    }
    //------------------------------
    const fechaInicioCompleta = new Date(`${dueDate}T${horaInicio}:00`);
    const fechaFinCompleta = new Date(`${dueDate}T${horaFin}:00`);


    //-------modificacion de hora de inicio no sea anterior a la hora actual si la fecha es hoy
    // Si la fecha seleccionada es hoy, la hora de inicio no puede ser anterior a la hora actual
    if (inputDateLocal.getTime() === todayLocal.getTime()) {
      if (fechaInicioCompleta < now) {
        setError('La hora de inicio no puede ser anterior a la hora actual cuando la fecha es hoy.');
        return;
      }
    }
    //---------------
    if (fechaInicioCompleta >= fechaFinCompleta) {
      setError('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    setLoading(true);
    try {
      const estadoFinal = columnaId ? String(columnaId) : '1';
      
      const newTask = await createTask({ 
        title: tituloLimpio, 
        description: descLimpia, 
        dueDate, 
        estado: estadoFinal,
        prioridad_id: Number(prioridadId),
        // Enviamos el horario armado como lo pide el backend
        horarios: [{
          inicio: fechaInicioCompleta.toISOString(),
          fin: fechaFinCompleta.toISOString(),
          tipo: 'Planificado'
        }]
      });
      
      setTitle('');
      setDescription('');
      // ------------------Reset a fecha y hora actuales del PC
      const nowReset = new Date();
      const tempFinReset = addHours(nowReset, 1);
      setDueDate(formatDate(nowReset));
      setHoraInicio(formatTime(nowReset));
      setHoraFin(tempFinReset.getDate() !== nowReset.getDate() ? '23:59' : formatTime(tempFinReset));
  
      // -----------------------------------
      setPrioridadId('2');
      onCreated?.(newTask);
    } catch (err: any) {
      setError(err?.message || 'Error creando tarea');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-full overflow-x-hidden">
      <div className="space-y-1">
        <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Título de la Tarea</label>
        <input
          className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan font-tarea text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors placeholder:text-brand-gray/50 shadow-sm"
          placeholder="Ej. Diseño de página..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Descripción</label>
        <textarea
          className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan font-horario-reg text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors resize-none placeholder:text-brand-gray/50 shadow-sm"
          placeholder="Detalles..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-1 flex-1">
          <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Fecha Límite</label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm"
          />
        </div>

        <div className="space-y-1 flex-1">
          <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Prioridad</label>
          <select 
            value={prioridadId} 
            onChange={(e) => setPrioridadId(e.target.value)} 
            className="w-full border-3 border-brand-dark p-3 rounded-2xl font-galilea font-tarea-bold text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm bg-white cursor-pointer"
          >
            <option value="1">🔥 Alta</option>
            <option value="2">⚡ Media</option>
            <option value="3">🧊 Baja</option>
          </select>
        </div>
      </div>

      {/* --- NUEVA FILA PARA LOS HORARIOS --- */}
      <div className="flex gap-4">
        <div className="space-y-1 flex-1">
          <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Hora Inicio</label>
          <input 
            type="time" 
            value={horaInicio} 
            onChange={(e) => setHoraInicio(e.target.value)} 
            className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm"
          />
        </div>
        <div className="space-y-1 flex-1">
          <label className="block text-xs font-galilea font-tarea-bold text-brand-gray uppercase tracking-wider ml-2">Hora Fin</label>
          <input 
            type="time" 
            value={horaFin} 
            onChange={(e) => setHoraFin(e.target.value)} 
            max="23:59"
            className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-brand-dark text-brand-white py-3.5 rounded-full font-titan text-xl shadow-[5px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-yellow hover:text-brand-dark hover:scale-[1.02] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 border-2 border-brand-dark uppercase tracking-wide"
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

export default TaskForm;