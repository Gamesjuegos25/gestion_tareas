import { useEffect, useState } from 'react';
import TaskForm from './TaskForm'; // <-- IMPORTAMOS EL FORMULARIO DE TU COMPAÑERO

export const Tablero = () => {
  const [tareas, setTareas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // ESTADOS DE FILTRO Y BÚSQUEDA (US-06 y US-07)
  const [filtroEstado, setFiltroEstado] = useState<string>('Todas');
  const [busqueda, setBusqueda] = useState<string>('');

  // ESTADOS DEL MODAL (Edición / Creación)
  const [tareaEditando, setTareaEditando] = useState<any>(null);
  const [columnaCreando, setColumnaCreando] = useState<number | null>(null); // <-- ESTADO PARA SABER DÓNDE CREAR
  const [tituloEdit, setTituloEdit] = useState('');
  const [descEdit, setDescEdit] = useState('');
  const [fechaEdit, setFechaEdit] = useState('');

  // 1. LEER TAREAS (GET)
  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(response => response.json())
      .then(data => {
        setTareas(data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar tareas:", error);
        setCargando(false);
      });
  }, []);

  // 2. ACTUALIZAR ESTADO AL ARRASTRAR (PATCH)
  const actualizarEstadoEnBD = (tareaId: number, nuevoEstadoId: number) => {
    fetch(`http://localhost:3000/tasks/${tareaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_id: nuevoEstadoId })
    })
      .then(response => response.json())
      .then(() => {
        setTareas(tareas.map(t => t.id === tareaId ? { ...t, estado_id: nuevoEstadoId } : t));
      })
      .catch(error => console.error("Error al actualizar estado:", error));
  };

  // 3. ELIMINAR TAREA (DELETE)
  const eliminarTarea = (tareaId: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;

    fetch(`http://localhost:3000/tasks/${tareaId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setTareas(tareas.filter(t => t.id !== tareaId));
      })
      .catch(error => console.error("Error al eliminar tarea:", error));
  };

  // 4. GUARDAR EDICIÓN (PATCH) - La creación ahora la maneja TaskForm
  const guardarEdicion = () => {
    if (!tituloEdit.trim() || !tareaEditando) return; 

    const payload: any = { titulo: tituloEdit, descripcion: descEdit };
    if (fechaEdit) payload.fechaLimite = new Date(fechaEdit).toISOString(); 

    fetch(`http://localhost:3000/tasks/${tareaEditando.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(() => {
        setTareas(tareas.map(t =>
          t.id === tareaEditando.id 
            ? { ...t, titulo: tituloEdit, descripcion: descEdit, fecha_limite: payload.fechaLimite } 
            : t
        ));
        cerrarModal();
      });
  };

  const cerrarModal = () => {
    setTareaEditando(null);
    setColumnaCreando(null); // Limpiamos también el estado de creación
    setTituloEdit('');
    setDescEdit('');
    setFechaEdit('');
  };

  // DRAG & DROP LOGIC
  const handleDragStart = (e: React.DragEvent, tareaId: number) => {
    e.dataTransfer.setData('text/plain', tareaId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, columnaId: number) => {
    e.preventDefault();
    const tareaId = e.dataTransfer.getData('text/plain');
    if (tareaId) actualizarEstadoEnBD(Number(tareaId), columnaId);
  };

  if (cargando) {
    return <div className="text-center p-10 font-bold text-xl text-gray-500">Cargando tablero...</div>;
  }

  // Definición base de columnas
  const columnasDelTablero = [
    { id: 1, titulo: 'To Do', progreso: '30%', dias: '7 days', tipo: 'Pendiente' },
    { id: 2, titulo: 'In Progress', progreso: '60%', dias: '3 days', tipo: 'Pendiente' },
    { id: 4, titulo: 'Done', progreso: '100%', dias: '0 days', tipo: 'Completada' }
  ];

  const columnasFiltradas = columnasDelTablero.filter(col => {
    if (filtroEstado === 'Todas') return true;
    if (filtroEstado === 'Pendientes') return col.tipo === 'Pendiente';
    if (filtroEstado === 'Completadas') return col.tipo === 'Completada';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8] p-10 font-sans">
      
      {/* BARRA SUPERIOR Y FILTROS */}
      <div className="mb-8 flex justify-between items-center bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex-wrap gap-4">
        <h1 className="text-2xl font-black text-[#001529]">Gestión de Tareas</h1>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por descripción o título..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-[#f0f4f8] border-2 border-transparent text-[#001529] font-medium py-2 px-4 pr-10 rounded-xl outline-none focus:border-[#001529] transition-colors w-64"
            />
            {busqueda && (
              <button 
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400 uppercase text-xs tracking-wider">Ver:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-[#f0f4f8] border-2 border-transparent text-[#001529] font-bold py-2 px-4 rounded-xl cursor-pointer outline-none focus:border-[#001529] transition-colors"
            >
              <option value="Todas">📚 Todas</option>
              <option value="Pendientes">⏳ Pendientes</option>
              <option value="Completadas">✅ Completadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONTENEDOR DEL TABLERO KANBAN */}
      <div className="relative flex gap-8 overflow-x-auto pb-4">
        {columnasFiltradas.map((columna) => {
          
          const tareasDeEstaColumna = tareas.filter(t => {
            const esDeEstaColumna = Number(t.estado_id) === columna.id;
            const terminoBusqueda = busqueda.toLowerCase();
            const coincideBusqueda = busqueda === '' || 
              (t.descripcion && t.descripcion.toLowerCase().includes(terminoBusqueda)) ||
              (t.titulo && t.titulo.toLowerCase().includes(terminoBusqueda));

            return esDeEstaColumna && coincideBusqueda;
          });

          return (
            <div key={columna.id} className="flex-1 min-w-[340px] flex flex-col gap-6">
              
              {/* ENCABEZADO DE COLUMNA */}
              <div className="bg-[#BCC4CD] rounded-[30px] p-6 flex flex-col shadow-lg border border-[#AAB4BF]">
                <div className="flex justify-center mb-6">
                  <h2 className="text-3xl font-black text-white bg-[#001529] px-6 py-2 rounded-full shadow-md select-none">
                    {columna.titulo}
                  </h2>
                </div>
                <div className="w-full h-3.5 bg-[#001529] rounded-full mb-1.5 overflow-hidden shadow-inner border border-[#001f3f]">
                  <div className="h-full bg-slate-200 rounded-full shadow-md" style={{ width: columna.progreso }}></div>
                </div>
                <div className="flex justify-between text-[#001529] font-extrabold text-sm mb-6 select-none">
                  <span>Progreso</span>
                  <span>{columna.progreso}</span>
                </div>
                <div className="flex justify-end items-center mt-auto">
                  
                  {/* BOTÓN + PARA CREAR TAREA AQUÍ */}
                  <button 
                    onClick={() => setColumnaCreando(columna.id)}
                    className="bg-[#001529] text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-extrabold shadow-lg hover:scale-110 transition-transform mr-auto"
                    title="Añadir nueva tarea aquí"
                  >
                    +
                  </button>

                  <span className="bg-[#001529] text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg select-none ml-auto">
                    {columna.dias}
                  </span>
                </div>
              </div>

              {/* ZONA DE CAÍDA (DROP ZONE) */}
              <div 
                className="bg-white rounded-[20px] p-5 flex flex-col gap-3 shadow-2xl border border-gray-100 flex-1 transition-colors hover:bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columna.id)}
              >
                {tareasDeEstaColumna.length === 0 ? (
                  <div className="text-center text-gray-400 font-bold py-10 pointer-events-none select-none">
                    {busqueda ? `No hay resultados para "${busqueda}"` : 'Suelta tareas aquí'}
                  </div>
                ) : (
                  tareasDeEstaColumna.map(tarea => (
                    <div 
                      key={tarea.id} 
                      className="relative group w-full flex justify-center cursor-grab active:cursor-grabbing"
                      draggable 
                      onDragStart={(e) => handleDragStart(e, tarea.id)}
                    >
                      <span className="bg-[#001529] text-white px-8 py-2 rounded-[20px] text-sm font-bold shadow-md w-full text-center transition-transform hover:scale-[1.02] block select-none">
                        {tarea.titulo}
                        {tarea.fecha_limite && (
                          <div className="text-[10px] text-gray-300 mt-1 font-normal">
                            📅 {new Date(tarea.fecha_limite).toLocaleDateString()}
                          </div>
                        )}
                      </span>

                      {/* CONTENEDOR DE BOTONES */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            setTareaEditando(tarea);
                            setTituloEdit(tarea.titulo || '');
                            setDescEdit(tarea.descripcion || '');
                            const fechaFormateada = tarea.fecha_limite ? new Date(tarea.fecha_limite).toISOString().split('T')[0] : '';
                            setFechaEdit(fechaFormateada);
                          }}
                          className="bg-white text-[#001529] rounded-full w-7 h-7 flex items-center justify-center shadow-lg text-sm hover:scale-110 cursor-pointer"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => eliminarTarea(tarea.id, e)}
                          className="bg-red-100 text-red-600 rounded-full w-7 h-7 flex items-center justify-center shadow-lg text-sm hover:scale-110 cursor-pointer hover:bg-red-200 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL UNIFICADO (EDICIÓN Y CREACIÓN) */}
      {(tareaEditando || columnaCreando) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-[30px] w-[500px] shadow-2xl border border-gray-200 flex flex-col gap-4 relative">
            
            <button onClick={cerrarModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 font-bold text-xl">
              ✕
            </button>

            <h3 className="text-2xl font-black text-[#001529] mb-4">
              {tareaEditando ? 'Editar Tarea' : 'Nueva Tarea'}
            </h3>
            
            {/* SI CREAMOS, USAMOS EL TASKFORM DE TU COMPAÑERO */}
            {columnaCreando ? (
              <TaskForm 
                columnaId={columnaCreando} 
                onCreated={(tareaNueva) => {
                  setTareas([...tareas, tareaNueva]);
                  cerrarModal(); 
                }} 
              />
            ) : (
              /* SI EDITAMOS, USAMOS TUS INPUTS CLÁSICOS */
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Título de la tarea</label>
                  <input
                    type="text"
                    value={tituloEdit}
                    onChange={(e) => setTituloEdit(e.target.value)}
                    className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-gray-700 focus:outline-none focus:border-[#001529]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</label>
                  <textarea
                    value={descEdit}
                    onChange={(e) => setDescEdit(e.target.value)}
                    rows={3}
                    className="w-full border-2 border-gray-100 p-3 rounded-xl font-medium text-gray-600 focus:outline-none focus:border-[#001529] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={fechaEdit}
                    onChange={(e) => setFechaEdit(e.target.value)}
                    className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold text-gray-700 focus:outline-none focus:border-[#001529]"
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={cerrarModal} className="px-5 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-full">
                    Cancelar
                  </button>
                  <button onClick={guardarEdicion} className="bg-[#001529] text-white px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                    Guardar Cambios
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};