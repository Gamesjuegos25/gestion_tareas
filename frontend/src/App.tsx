<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
=======
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { useState } from 'react';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async (task: any) => {
    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!res.ok) {
        const error = await res.json();
        alert('Error al guardar: ' + (error.message || 'Error desconocido'));
        return;
      }
      setRefresh(r => !r);
      setShowModal(false);
    } catch (err) {
      alert('No se pudo conectar con el servidor');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: 'linear-gradient(120deg, #eaf6ff 0%, #f7f9fc 100%)', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div style={{ width: '100vw', maxWidth: '1800px', margin: '0 auto', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ textAlign: 'center', color: '#222', fontWeight: 900, fontSize: '3rem', marginBottom: '32px', letterSpacing: '-2px' }}>Gestión de Tareas</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', width: '100%' }}>
          <button onClick={() => setShowModal(true)} style={{ padding: '16px 40px', background: '#4f8cff', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 700, boxShadow: '0 2px 12px #0001', transition: 'background 0.2s' }}>Nueva Tarea</button>
        </div>
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', minWidth: '360px', boxShadow: '0 8px 32px #0003', position: 'relative', maxWidth: '95vw' }}>
              <TaskForm onSave={handleSave} onCancel={handleCancel} />
            </div>
          </div>
        )}
        <div style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
          <TaskList refresh={refresh} />
        </div>
      </div>
    </div>
  );
>>>>>>> Stashed changes
}

export default App
