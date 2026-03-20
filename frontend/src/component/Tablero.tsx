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
  const [prioridadEdit, setPrioridadEdit] = useState('2');
  
  const [horaInicioEdit, setHoraInicioEdit] = useState('10:00');
  const [horaFinEdit, setHoraFinEdit] = useState('12:00');
  
  const [errorEdit, setErrorEdit] = useState<string | null>(null);
  const [columnasAbiertas, setColumnasAbiertas] = useState<number[]>([1]);
  const [columnaHover, setColumnaHover] = useState<number | null>(null);

  const actualizarEstadoEnBD = (tareaId: number, nuevoEstadoId: number) => {
    fetch(`http://localhost:3000/tasks/${tareaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_id: nuevoEstadoId })
    })
    .then(() => {
      const nuevoPorcentaje = nuevoEstadoId === 1 ? 30 : nuevoEstadoId === 2 ? 60 : 100;
      
      setTareas(tareas.map(t => {
        if (t.id === tareaId) {
          const nuevosFlujos = [...(t.flujos || []), { porcentaje_avance: nuevoPorcentaje }];
          return { ...t, estado_id: nuevoEstadoId, flujos: nuevosFlujos };
        }
        return t;
      }));
    });
  };

  const eliminarTarea = (tareaId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    fetch(`http://localhost:3000/tasks/${tareaId}`, { method: 'DELETE' })
      .then(() => setTareas(tareas.filter(t => t.id !== tareaId)));
  };

  const guardarEdicion = () => {
    const tituloLimpio = tituloEdit.trim();
    const descLimpia = descEdit.trim();

    if (!tituloLimpio) { setErrorEdit('El título no puede estar vacío.'); return; }
    if (!descLimpia) { setErrorEdit('La descripción no puede estar vacía.'); return; }

    const tieneTextoValido = /[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/;
    if (!tieneTextoValido.test(tituloLimpio)) { setErrorEdit('El título no puede contener solo símbolos.'); return; }
    if (!tieneTextoValido.test(descLimpia)) { setErrorEdit('La descripción debe contener texto válido.'); return; }

    let horariosNuevos: any[] = [];

    if (fechaEdit) {
      const [y, m, d] = fechaEdit.split('-').map(Number);
      const inputDateLocal = new Date(y, m - 1, d);
      const now = new Date();
      const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (inputDateLocal < todayLocal) {
        setErrorEdit('No puedes actualizar la fecha límite a un día que ya pasó.');
        return;
      }

      const fechaInicioCompleta = new Date(`${fechaEdit}T${horaInicioEdit}:00`);
      const fechaFinCompleta = new Date(`${fechaEdit}T${horaFinEdit}:00`);

      if (fechaInicioCompleta >= fechaFinCompleta) {
        setErrorEdit('La hora de fin debe ser posterior a la de inicio.');
        return;
      }

      horariosNuevos = [{
        inicio: fechaInicioCompleta.toISOString(),
        fin: fechaFinCompleta.toISOString(),
        tipo: 'Planificado'
      }];
    }

    if (!tareaEditando) return;
    setErrorEdit(null); 

    // 👇 EL TRUCO DEL MEDIODÍA: Agregamos T12:00:00.000Z a la fecha 👇
    const payloadBackend = { 
      titulo: tituloLimpio, 
      descripcion: descLimpia, 
      fechaLimite: fechaEdit ? `${fechaEdit}T12:00:00.000Z` : null, 
      prioridad_id: Number(prioridadEdit),
      horarios: horariosNuevos 
    };

    fetch(`http://localhost:3000/tasks/${tareaEditando.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadBackend)
    })
    .then(() => {
      const datosParaReact = {
        titulo: tituloLimpio,
        descripcion: descLimpia,
        fecha_limite: payloadBackend.fechaLimite,
        prioridad_id: Number(prioridadEdit),
        horarios: horariosNuevos
      };

      setTareas(tareas.map(t => t.id === tareaEditando.id ? { ...t, ...datosParaReact } : t));
      cerrarModal();
    });
  };

  const cerrarModal = () => {
    setTareaEditando(null);
    setColumnaCreando(null);
    setTituloEdit('');
    setDescEdit('');
    setFechaEdit('');
    setPrioridadEdit('2');
    setHoraInicioEdit('10:00');
    setHoraFinEdit('12:00');
    setErrorEdit(null); 
  };

  const toggleColumna = (id: number) => {
    setColumnasAbiertas(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const obtenerEstiloPrioridad = (prioridadId: number) => {
    switch (Number(prioridadId)) {
      case 1: return { color: 'bg-red-500 text-white border-red-700', label: 'Alta' };
      case 2: return { color: 'bg-brand-yellow text-brand-dark border-yellow-500', label: 'Media' };
      case 3: return { color: 'bg-green-400 text-brand-dark border-green-600', label: 'Baja' };
      default: return { color: 'bg-brand-light text-brand-dark border-brand-gray', label: 'No def.' };
    }
  };

  const columnasDelTablero = [
    { id: 1, titulo: 'To Do', tipo: 'Pendiente' },
    { id: 2, titulo: 'In Progress', tipo: 'Pendiente' },
    { id: 3, titulo: 'Done', tipo: 'Completada' }
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

          // CÁLCULO DE PROGRESO DE FLUJO GLOBAL
          const totalTareas = tareas.length;
          let progresoNumero = 0;
          
          if (totalTareas > 0) {
            if (columna.id === 1) {
              const tareasFueraDeToDo = tareas.filter(t => Number(t.estado_id) !== 1).length;
              progresoNumero = Math.round((tareasFueraDeToDo / totalTareas) * 100);
            } else if (columna.id === 2) {
              const tareasEnProgreso = tareas.filter(t => Number(t.estado_id) === 2).length;
              progresoNumero = Math.round(((totalTareas - tareasEnProgreso) / totalTareas) * 100);
            } else if (columna.id === 3) {
              const tareasTerminadas = tareas.filter(t => Number(t.estado_id) === 3).length;
              progresoNumero = Math.round((tareasTerminadas / totalTareas) * 100);
            }
          }
          const progresoTexto = `${progresoNumero}%`;

          // CÁLCULO DE DÍAS RESTANTES
          let diasTexto = "-";
          let colorAlerta = "bg-brand-dark text-brand-white";

          if (columna.id === 3) {
            diasTexto = "Done";
            colorAlerta = "bg-green-500 text-white border-green-700";
          } else if (tareasDeEstaColumna.length > 0) {
            const tareasConFecha = tareasDeEstaColumna.filter(t => t.fecha_limite);
            
            if (tareasConFecha.length > 0) {
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);

              const diasFaltantes = tareasConFecha.map(t => {
                const fechaLimite = new Date(t.fecha_limite);
                fechaLimite.setHours(0, 0, 0, 0);
                const diffTime = fechaLimite.getTime() - hoy.getTime();
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              });

              const minDias = Math.min(...diasFaltantes);

              if (minDias < 0) {
                diasTexto = "Overdue";
                colorAlerta = "bg-red-500 text-white border-red-700 animate-pulse";
              } else if (minDias === 0) {
                diasTexto = "Today";
                colorAlerta = "bg-orange-500 text-white border-orange-700";
              } else if (minDias === 1) {
                diasTexto = "1 day";
              } else {
                diasTexto = `${minDias} days`;
              }
            } else {
              diasTexto = "No date";
            }
          }

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
                
                {/* BARRA DE PROGRESO */}
                <div className="w-full h-4 bg-brand-dark rounded-full mb-1 overflow-hidden border-2 border-brand-dark shadow-inner">
                  <div 
                    className="h-full bg-brand-white rounded-full transition-all duration-700 ease-out" 
                    style={{ width: progresoTexto }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-brand-dark font-galilea font-tarea-bold text-xs mb-6 px-1 transition-all">
                  <span>Progreso</span>
                  <span className="font-titan">{progresoTexto}</span>
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
                  <span className={`px-4 py-2 rounded-full text-[11px] font-titan border-2 shadow-md transition-colors ${colorAlerta}`}>
                    {diasTexto}
                  </span>
                </div>
              </div>

              {estaAbierta && (
                <div className="flex flex-col gap-4 p-2 min-h-32 transition-all">
                  {tareasDeEstaColumna.map(tarea => {
                    const estiloPrioridad = obtenerEstiloPrioridad(tarea.prioridad_id);
                    
                    return (
                      <div 
                        key={tarea.id} 
                        draggable 
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', tarea.id.toString())}
                        className="bg-brand-dark text-brand-white p-5 rounded-[25px] shadow-lg cursor-grab hover:scale-[1.03] active:cursor-grabbing border-2 border-brand-dark transition-all group relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-titan font-tarea text-lg leading-tight pr-6">{tarea.titulo}</h4>
                          <span className={`text-[9px] font-titan px-2 py-0.5 rounded-md border shadow-sm ${estiloPrioridad.color}`}>
                            {estiloPrioridad.label}
                          </span>
                        </div>
                        
                        {tarea.fecha_limite && (
                          <p className="text-[11px] font-titan mt-2 text-brand-light opacity-90 flex items-center gap-2">
                            ⏱ {tarea.fecha_limite.split('T')[0].split('-').reverse().join('/')}
                          </p>
                        )}
                        
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark/80 p-1 rounded-full backdrop-blur-sm">
                          <button 
                            onClick={() => { 
                              setTareaEditando(tarea); 
                              setTituloEdit(tarea.titulo); 
                              setDescEdit(tarea.descripcion); 
                              setFechaEdit(tarea.fecha_limite?.split('T')[0] || '');
                              setPrioridadEdit(tarea.prioridad_id ? String(tarea.prioridad_id) : '2'); 

                              if (tarea.horarios && tarea.horarios.length > 0) {
                                const pad = (n: number) => String(n).padStart(2, '0');
                                const dInicio = new Date(tarea.horarios[0].inicio);
                                const dFin = new Date(tarea.horarios[0].fin);
                                
                                setHoraInicioEdit(`${pad(dInicio.getHours())}:${pad(dInicio.getMinutes())}`);
                                setHoraFinEdit(`${pad(dFin.getHours())}:${pad(dFin.getMinutes())}`);
                              } else {
                                setHoraInicioEdit('10:00');
                                setHoraFinEdit('12:00');
                              }
                            }} 
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
                    )
                  })}
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

      {/* MODAL DE EDICIÓN / CREACIÓN */}
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
                <div className="flex flex-col gap-4 w-full">
                  <div className="space-y-1">
                    <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Título</label>
                    <input 
                      type="text" 
                      value={tituloEdit} 
                      onChange={(e) => setTituloEdit(e.target.value)} 
                      className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan font-tarea outline-none focus:bg-brand-yellow/5 text-brand-dark shadow-sm" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Descripción</label>
                    <textarea 
                      value={descEdit} 
                      onChange={(e) => setDescEdit(e.target.value)} 
                      className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan font-horario-reg outline-none focus:bg-brand-yellow/5 text-brand-dark resize-none" 
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="flex gap-4">
                    <div className="space-y-1 flex-1">
                      <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Fecha Límite</label>
                      <input 
                        type="date" 
                        value={fechaEdit} 
                        onChange={(e) => setFechaEdit(e.target.value)} 
                        className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan outline-none focus:bg-brand-yellow/5 text-brand-dark" 
                      />
                    </div>

                    <div className="space-y-1 flex-1">
                      <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Prioridad</label>
                      <select 
                        value={prioridadEdit} 
                        onChange={(e) => setPrioridadEdit(e.target.value)} 
                        className="w-full border-3 border-brand-dark p-3 rounded-2xl font-galilea font-tarea-bold text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm bg-white cursor-pointer"
                      >
                        <option value="1">🔥 Alta</option>
                        <option value="2">⚡ Media</option>
                        <option value="3">🧊 Baja</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="space-y-1 flex-1">
                      <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Hora Inicio</label>
                      <input 
                        type="time" 
                        value={horaInicioEdit} 
                        onChange={(e) => setHoraInicioEdit(e.target.value)} 
                        className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-xs font-galilea font-tarea-bold text-brand-gray ml-2 uppercase">Hora Fin</label>
                      <input 
                        type="time" 
                        value={horaFinEdit} 
                        onChange={(e) => setHoraFinEdit(e.target.value)} 
                        className="w-full border-3 border-brand-dark p-3 rounded-2xl font-titan text-brand-dark outline-none focus:bg-brand-yellow/5 transition-colors shadow-sm"
                      />
                    </div>
                  </div>

                  {errorEdit && (
                    <div className="bg-red-50 border-2 border-red-500 text-red-600 p-3 rounded-xl font-galilea font-tarea-bold text-sm text-center animate-bounce mt-2">
                      ⚠️ {errorEdit}
                    </div>
                  )}

                  <button 
                    onClick={guardarEdicion} 
                    className="w-full bg-brand-dark text-brand-white py-3.5 rounded-full font-titan text-xl hover:bg-brand-yellow hover:text-brand-dark transition-all shadow-[5px_5px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none mt-2 border-2 border-brand-dark"
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