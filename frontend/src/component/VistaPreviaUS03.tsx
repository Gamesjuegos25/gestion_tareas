import { useState } from 'react';
import { ModalDeEdicion } from './ModalDeEdicion';
import { FormularioEditar } from './FormularioEditar';

export const VistaPreviaUS03 = () => {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-6 text-slate-700">Entorno de Pruebas: US-03 Editar Tarea</h1>
      
      {/* Este botón simula el clic que el usuario daría en una tarea real */}
      <button 
        onClick={() => setMostrarModal(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
      >
        Simular clic en Tarea (Abrir Edición)
      </button>

      {/* Solo se renderiza si mostrarModal es true */}
      {mostrarModal && (
        <ModalDeEdicion alCerrar={() => setMostrarModal(false)}>
          <FormularioEditar />
        </ModalDeEdicion>
      )}
    </div>
  );
};