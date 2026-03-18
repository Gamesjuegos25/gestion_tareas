import { useState, type FC } from 'react';

interface SidebarRightProps {
  tareas: any[];
  onAddTask: () => void;
  onCompleteTask: (id: number) => void;
}

export const SidebarRight: FC<SidebarRightProps> = ({ tareas, onAddTask, onCompleteTask }) => {
  // --- LÓGICA DEL CALENDARIO DINÁMICO ---
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const mesAnterior = () => setFechaSeleccionada(new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() - 1, 1));
  const mesSiguiente = () => setFechaSeleccionada(new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() + 1, 1));

  const nombreMes = fechaSeleccionada.toLocaleString('es-ES', { month: 'long' });
  const nombreMesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

  const formatearFechaLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const obtenerDiasSemana = () => {
    const dias = [];
    const inicio = new Date(fechaSeleccionada);
    inicio.setDate(inicio.getDate() - 2); 

    for (let i = 0; i < 6; i++) {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      dias.push(d);
    }
    return dias;
  };

  const diasTira = obtenerDiasSemana();
  const hoyStr = formatearFechaLocal(fechaSeleccionada);
  const tareasDelDia = tareas.filter(t => t.fecha_limite?.startsWith(hoyStr));

  // Lógica de Miembros
  const miembros = [
    { nombre: "Cristina Maldonado", cargo: "Desarrollador, Scrum Master" },
    { nombre: "Pedro Barillas", cargo: "Desarrollador" },
    { nombre: "Anibal Vasquez", cargo: "Desarrollador" },
    { nombre: "Malon Alvarez", cargo: "Desarrollador" }
  ];

  // Función para manejar el error de carga de imagen
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, nombre: string) => {
    e.currentTarget.style.display = 'none'; 
    const parent = e.currentTarget.parentElement;
    if (parent) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = "w-full h-full bg-brand-dark flex items-center justify-center text-white text-[10px] font-titan";
      fallbackDiv.innerText = nombre.charAt(0);
      parent.appendChild(fallbackDiv);
    }
  };

  return (
    <aside className="w-350px h-screen bg-white border-l-2 border-brand-light flex flex-col p-6 space-y-6 overflow-y-auto scrollbar-hide">
      
      {/* PERFIL (CABECERA) */}
      <div className="flex items-center gap-4 bg-brand-light p-4 rounded-[25px] shrink-0 border-2 border-brand-dark/5 shadow-sm">
        <div className="w-14 h-14 bg-brand-dark rounded-full overflow-hidden border-2 border-brand-dark shrink-0">
            <img 
              src="/Mike.png" 
              alt="Mike" 
              className="w-full h-full object-cover" 
              onError={(e) => handleImageError(e, "Mike")}
            /> 
        </div>
        <div>
          <h2 className="text-2xl font-titan text-brand-dark leading-tight">Mike</h2>
          <p className="text-[9px] font-galilea font-detalle-light text-brand-dark uppercase tracking-wider">Web Designer/Project Owner</p>
        </div>
      </div>

      {/* SECCIÓN CALENDARIO DINÁMICO */}
      <div className="bg-brand-light p-5 rounded-[35px] border-2 border-brand-dark/5 shadow-md shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button onClick={mesAnterior} className="text-brand-gray hover:text-brand-dark transition-colors font-titan text-lg">◀</button>
            <h3 className="text-xl font-titan text-brand-dark min-w-100px text-center">{nombreMesCapitalizado}</h3>
            <button onClick={mesSiguiente} className="text-brand-gray hover:text-brand-dark transition-colors font-titan text-lg">▶</button>
          </div>
          
          <button 
            onClick={onAddTask}
            className="bg-brand-dark text-brand-white text-[10px] px-3 py-1.5 rounded-full font-titan hover:bg-brand-yellow hover:text-brand-dark transition-all border-2 border-brand-dark flex items-center gap-1 uppercase"
          >
            <span className="text-sm">+</span> add task
          </button>
        </div>

        <div className="flex justify-between mb-8">
          {diasTira.map((dia, index) => {
            const esHoy = formatearFechaLocal(dia) === hoyStr;
            const inicialDia = dia.toLocaleString('es-ES', { weekday: 'narrow' }).toUpperCase();
            
            return (
              <div 
                key={index} 
                onClick={() => setFechaSeleccionada(dia)}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${esHoy ? 'scale-110' : 'hover:opacity-70'}`}
              >
                <span className={`text-sm font-titan mb-1 ${esHoy ? 'text-brand-dark' : 'text-brand-gray'}`}>
                  {dia.getDate()}
                </span>
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-titan text-xs border-2 transition-colors ${
                  esHoy ? 'bg-brand-dark text-brand-white border-brand-dark shadow-md' : 'bg-transparent text-brand-dark border-transparent'
                }`}>
                  {inicialDia}
                </div>
              </div>
            );
          })}
        </div>

        {/* TIMELINE DE TAREAS (HORA DINÁMICA) */}
        <div className="space-y-6 relative before:absolute before:left-11px before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-dark/10">
          {tareasDelDia.length > 0 ? tareasDelDia.map((t, idx) => {
            // Lógica para extraer la hora de inicio y fin reales
            let horaInicioStr = `${10 + idx}:00`; // Respaldo por si es una tarea antigua sin horario
            let rangoStr = 'Tarea programada';

            if (t.horarios && t.horarios.length > 0) {
              const dInicio = new Date(t.horarios[0].inicio);
              const dFin = new Date(t.horarios[0].fin);
              
              if (!isNaN(dInicio.getTime()) && !isNaN(dFin.getTime())) {
                horaInicioStr = dInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const horaFinStr = dFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                rangoStr = `${horaInicioStr} - ${horaFinStr}`;
              }
            }

            return (
              <div key={t.id} className="relative pl-10">
                {/* HORA EN LA LÍNEA DEL TIEMPO */}
                <span className="absolute left-0 top-1 text-[10px] font-titan text-brand-dark">
                  {horaInicioStr}
                </span>
                <div className="bg-brand-white p-4 rounded-2xl border-2 border-brand-dark shadow-[4px_4px_0px_rgba(0,29,61,0.1)] group relative">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-dark rounded-l-md"></div>
                  <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[11px] font-galilea font-tarea-bold text-brand-dark leading-tight pr-4">
                          {t.titulo}
                      </h4>
                      <span className="text-brand-dark opacity-30 text-[10px]">•••</span>
                  </div>
                  {/* TEXTO DENTRO DE LA TARJETA */}
                  <p className="text-[9px] font-titan text-brand-gray">{rangoStr}</p>
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-6">
              <p className="text-[10px] font-titan text-brand-dark opacity-30">No hay tareas para este día</p>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN ASSIGNAMENTS */}
      <div className="bg-white border-2 border-brand-light p-6 rounded-[30px] shadow-sm shrink-0">
        <h3 className="text-xl font-titan font-tarea-bold text-brand-dark mb-3">Assignaments ({tareas.length})</h3>
        <p className="text-[10px] mb-4 font-galilea font-horario-reg flex items-center">
          ✔ Complete <span className="font-titan text-brand-dark text-sm ml-2">{tareas.filter(t => Number(t.estado_id) === 3).length}/{tareas.length}</span>
        </p>

        <div className="space-y-4">
          {tareas.slice(0, 5).map((tarea) => {
            const esDone = Number(tarea.estado_id) === 3;
            return (
              <div 
                key={tarea.id} 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => !esDone && onCompleteTask(tarea.id)}
              >
                <div className={`w-5 h-5 rounded-md border-2 border-brand-dark flex items-center justify-center transition-colors shrink-0 ${esDone ? 'bg-brand-dark' : 'bg-transparent group-hover:bg-brand-yellow/20'}`}>
                  {esDone && <span className="text-white text-[10px]">✔</span>}
                </div>
                <span className={`text-[11px] font-galilea transition-all truncate ${esDone ? 'line-through text-brand-gray italic' : 'text-brand-dark font-tarea-bold'}`}>
                  {tarea.titulo}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN MIEMBROS */}
      <div className="bg-brand-light p-6 rounded-[30px] border-2 border-brand-dark/5 shadow-sm shrink-0">
        <h3 className="text-xl font-titan text-brand-dark mb-4 text-center">Miembros</h3>
        <div className="space-y-3">
          {miembros.map((m, index) => (
            <div key={index} className="bg-brand-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border-2 border-transparent hover:border-brand-dark transition-all cursor-pointer">
              
              <div className="w-8 h-8 bg-brand-dark rounded-full overflow-hidden shrink-0 border border-brand-dark flex items-center justify-center text-white text-[10px] font-titan relative">
                <img 
                  src={`/${m.nombre}.png`} 
                  alt={m.nombre} 
                  className="w-full h-full object-cover" 
                  onError={(e) => handleImageError(e, m.nombre)} 
                />
              </div>

              <div className="overflow-hidden">
                <h4 className="text-[10px] font-galilea font-tarea-bold text-brand-dark truncate">{m.nombre}</h4>
                <p className="text-[8px] font-galilea font-detalle-light text-brand-gray uppercase tracking-tighter">{m.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};