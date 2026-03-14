import { useState, type FC, type Dispatch, type SetStateAction } from 'react';
import TaskForm from './TaskForm';

interface TableroProps {
  tareas: any[];
  setTareas: Dispatch<SetStateAction<any[]>>;
  columnaCreando: number | null;
  setColumnaCreando: Dispatch<SetStateAction<number | null>>;
}

export const Tablero: FC<TableroProps> = ({ tareas, setTareas, columnaCreando, setColumnaCreando }) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('Todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [tareaEditando, setTareaEditando] = useState<any>(null);
  const [tituloEdit, setTituloEdit] = useState('');
  const [descEdit, setDescEdit] = useState('');
  const [fechaEdit, setFechaEdit] = useState('');
  const [columnasAbiertas, setColumnasAbiertas] = useState<number[]>([1]);
  const [columnaHover, setColumnaHover] = useState<number | null>(null);

  const actualizarEstadoEnBD = (tareaId: number, nuevoEstadoId: number) => {
    fetch(`http://localhost:3000/tasks/${tareaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_id: nuevoEstadoId })
    })
    .then(() => {
      setTareas(tareas.map(t => t.id === tareaId ? { ...t, estado_id: nuevoEstadoId } : t));
    });
  };

  const eliminarTarea = (tareaId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    fetch(`http://localhost:3000/tasks/${tareaId}`, { method: 'DELETE' })
      .then(() => setTareas(tareas.filter(t => t.id !== tareaId)));
  };

  const guardarEdicion = () => {
    if (!tituloEdit.trim() || !tareaEditando) return;
    const payload = { titulo: tituloEdit, descripcion: descEdit, fecha_limite: fechaEdit ? new Date(fechaEdit).toISOString() : null };
    fetch(`http://localhost:3000/tasks/${tareaEditando.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      setTareas(tareas.map(t => t.id === tareaEditando.id ? { ...t, ...payload } : t));
      cerrarModal();
    });
  };

  const cerrarModal = () => {
    setTareaEditando(null);
    setColumnaCreando(null);
    setTituloEdit('');
    setDescEdit('');
    setFechaEdit('');
  };

  const toggleColumna = (id: number) => {
    setColumnasAbiertas(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const columnasDelTablero = [
    { id: 1, titulo: 'To Do', progreso: '30%', dias: '7 days', tipo: 'Pendiente' },
    { id: 2, titulo: 'In Progress', progreso: '60%', dias: '3 days', tipo: 'Pendiente' },
    { id: 3, titulo: 'Done', progreso: '100%', dias: '0 days', tipo: 'Completada' }
  ];

  const columnasFiltradas = columnasDelTablero.filter(col => {
    if (filtroEstado === 'Todas') return true;
    if (filtroEstado === 'Pendientes') return col.tipo === 'Pendiente';
    if (filtroEstado === 'Completadas') return col.tipo === 'Completada';
    return true;
  });

  return (
    <div className="flex flex-col gap-10">
      
      {/* BARRA DE FILTROS */}
      <div className="flex justify-between items-center bg-brand-light p-5 rounded-[30px] border-2 border-brand-dark/10 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-brand-white border-2 border-brand-dark py-2 px-6 rounded-full font-galilea font-horario-reg outline-none focus:ring-4 focus:ring-brand-yellow/30 w-80 text-brand-dark"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="bg-brand-dark text-brand-white py-2 px-8 rounded-full font-titan outline-none cursor-pointer hover:bg-brand-yellow hover:text-brand-dark transition-colors border-2 border-brand-dark"
        >
          <option value="Todas">Todas</option>
          <option value="Pendientes">Pendientes</option>
          <option value="Completadas">Completadas</option>
        </select>
      </div>

      {/* CONTENEDOR KANBAN */}
      <div className="flex gap-8 items-start">
        {columnasFiltradas.map((columna) => {
          const estaAbierta = columnasAbiertas.includes(columna.id);
          const esHover = columnaHover === columna.id;
          
          const tareasDeEstaColumna = tareas.filter(t => {
            const esDeEstaColumna = Number(t.estado_id) === columna.id;
            const coincideBusqueda = busqueda === '' || 
              (t.descripcion?.toLowerCase().includes(busqueda.toLowerCase())) ||
              (t.titulo?.toLowerCase().includes(busqueda.toLowerCase()));
            return esDeEstaColumna && coincideBusqueda;
          });

          return (
            <div key={columna.id} className="flex-1 flex flex-col gap-6">
              
              <div 
                className={`rounded-[35px] p-6 border-2 border-brand-dark transition-all duration-300 shadow-[8px_8px_0px_rgba(0,29,61,0.1)] ${
                  esHover ? 'bg-brand-yellow' : 'bg-brand-light'
                }`}
                onDragOver={(e) => { e.preventDefault(); setColumnaHover(columna.id); }}
                onDragLeave={() => setColumnaHover(null)}
                onDrop={(e) => {
                  setColumnaHover(null);
                  const id = e.dataTransfer.getData('text/plain');
                  actualizarEstadoEnBD(Number(id), columna.id);
                }}
              >
                <h2 className="text-3xl font-galilea font-tarea-bold text-brand-dark text-center mb-4 tracking-tight">
                  {columna.titulo}
                </h2>
                
                <div className="w-full h-4 bg-brand-dark rounded-full mb-1 overflow-hidden border-2 border-brand-dark shadow-inner">
                  <div className="h-full bg-brand-white rounded-full transition-all duration-700" style={{ width: columna.progreso }}></div>
                </div>
                
                <div className="flex justify-between items-center text-brand-dark font-galilea font-tarea-bold text-xs mb-6 px-1">
                  <span>Progreso</span>
                  <span className="font-titan">{columna.progreso}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => toggleColumna(columna.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl font-black shadow-lg border-2 border-brand-dark transition-all duration-300 ${
                      estaAbierta 
                        ? 'rotate-45 bg-brand-dark text-brand-white' 
                        : 'bg-brand-dark text-brand-white hover:bg-brand-yellow hover:text-brand-dark'
                    }`}
                  >
                    +
                  </button>
                  <span className="bg-brand-dark text-brand-white px-5 py-2 rounded-full text-xs font-titan border-2 border-brand-dark shadow-md">
                    {columna.dias}
                  </span>
                </div>
              </div>

              {estaAbierta && (
                <div className="flex flex-col gap-4 p-2 min-h-32 transition-all">
                  {tareasDeEstaColumna.map(tarea => (
                    <div 
                      key={tarea.id} 
                      draggable 
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', tarea.id.toString())}
                      className="bg-brand-dark text-brand-white p-5 rounded-[25px] shadow-lg cursor-grab hover:scale-[1.03] active:cursor-grabbing border-2 border-brand-dark transition-all group relative"
                    >
                      <h4 className="font-galilea font-tarea-bold text-lg leading-tight">{tarea.titulo}</h4>
                      {tarea.fecha_limite && (
                        <p className="text-[11px] font-titan mt-3 text-brand-light opacity-90 flex items-center gap-2">
                          {/* PARCHE HORARIO APLICADO AQUÍ */}
                          ⏱ {tarea.fecha_limite.split('T')[0].split('-').reverse().join('/')}
                        </p>
                      )}
                      
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setTareaEditando(tarea); setTituloEdit(tarea.titulo); setDescEdit(tarea.descripcion); setFechaEdit(tarea.fecha_limite?.split('T')[0] || ''); }} 
                          className="bg-brand-white text-brand-dark w-8 h-8 rounded-full border-2 border-brand-dark flex items-center justify-center hover:bg-brand-yellow transition-colors"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={(e) => eliminarTarea(tarea.id, e)} 
                          className="bg-red-500 text-white w-8 h-8 rounded-full border-2 border-brand-dark flex items-center justify-center hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  {tareasDeEstaColumna.length === 0 && (
                    <div className="text-center py-10 text-brand-gray font-galilea font-detalle-light border-4 border-dashed border-brand-light rounded-[30px] opacity-40">
                      Arrastre tareas aquí
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL UNIFICADO - ADAPTABLE Y SIN DESBORDAMIENTO */}
      {(tareaEditando || columnaCreando) && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md flex items-center justify-center z-100 p-4 sm:p-6">
          <div className="bg-brand-white p-6 sm:p-10 rounded-[45px] w-full max-w-lg shadow-[15px_15px_0px_rgba(0,0,0,0.2)] relative border-4 border-brand-dark flex flex-col">
            
            <button 
              onClick={cerrarModal} 
              className="absolute top-6 right-8 text-brand-dark hover:text-brand-yellow font-titan text-2xl z-20 transition-colors"
            >
              ✕
            </button>

            <div className="overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <h3 className="text-3xl sm:text-4xl font-galilea font-tarea-bold text-brand-dark mb-6">
                {tareaEditando ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              
              {columnaCreando ? (
                <div className="w-full">
                  <TaskForm 
                    columnaId={columnaCreando} 
                    onCreated={(nt) => { setTareas([...tareas, nt]); cerrarModal(); }} 
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-5 w-full">
                  <div className="space-y-1">
                    <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Título</label>
                    <input 
                      type="text" 
                      value={tituloEdit} 
                      onChange={(e) => setTituloEdit(e.target.value)} 
                      className="w-full border-3 border-brand-dark p-3.5 rounded-2xl font-galilea font-tarea-bold outline-none focus:bg-brand-yellow/5 text-brand-dark shadow-sm" 
                      placeholder="Ej. Comprar café..." 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Descripción</label>
                    <textarea 
                      value={descEdit} 
                      onChange={(e) => setDescEdit(e.target.value)} 
                      className="w-full border-3 border-brand-dark p-3.5 rounded-2xl font-galilea font-horario-reg outline-none focus:bg-brand-yellow/5 text-brand-dark resize-none" 
                      placeholder="Detalles de la tarea..." 
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Fecha Límite</label>
                    <input 
                      type="date" 
                      value={fechaEdit} 
                      onChange={(e) => setFechaEdit(e.target.value)} 
                      className="w-full border-3 border-brand-dark p-3.5 rounded-2xl font-titan outline-none focus:bg-brand-yellow/5 text-brand-dark" 
                    />
                  </div>

                  <button 
                    onClick={guardarEdicion} 
                    className="w-full bg-brand-dark text-brand-white py-4 rounded-full font-titan text-xl hover:bg-brand-yellow hover:text-brand-dark transition-all shadow-[5px_5px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none mt-4 border-2 border-brand-dark"
                  >
                    GUARDAR CAMBIOS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};