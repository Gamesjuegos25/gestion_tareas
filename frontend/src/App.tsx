import { useState, useEffect } from 'react';
import { Sidebar } from './component/Sidebar';
import { Tablero } from './component/Tablero';
import { SidebarRight } from './component/SidebarRight';
import { WelcomeCard } from './component/WelcomeCard';

function App() {
  const [tareas, setTareas] = useState<any[]>([]);
  const [columnaCreando, setColumnaCreando] = useState<number | null>(null);

  const cargarTareas = () => {
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => setTareas(data));
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  // FUNCIÓN PARA COMPLETAR DESDE EL SIDEBAR (TACHAR)
  const completarTareaRapido = (tareaId: number) => {
    const ID_DONE = 3; // ID de tu columna 'Done'
    fetch(`http://localhost:3000/tasks/${tareaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado_id: ID_DONE })
    })
    .then(() => {
      setTareas(prev => prev.map(t => t.id === tareaId ? { ...t, estado_id: ID_DONE } : t));
    });
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-galilea">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto p-10 space-y-10 bg-white">
        <WelcomeCard />
        <Tablero 
          tareas={tareas} 
          setTareas={setTareas} 
          columnaCreando={columnaCreando} 
          setColumnaCreando={setColumnaCreando} 
        />
      </main>

      <SidebarRight 
        tareas={tareas} 
        onAddTask={() => setColumnaCreando(1)}
        onCompleteTask={completarTareaRapido}
      />
    </div>
  );
}

export default App;