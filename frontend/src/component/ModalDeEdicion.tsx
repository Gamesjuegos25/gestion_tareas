interface Props {
  children: React.ReactNode;
  alCerrar: () => void;
}

export const ModalDeEdicion = ({ children, alCerrar }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro (Overlay) */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={alCerrar} // Cierra si haces clic afuera
      ></div>

      {/* Caja del contenido */}
      <div className="relative bg-white rounded-xl shadow-2xl p-2 w-full max-w-lg z-10 animate-in fade-in zoom-in duration-200">
        {/* Botón X para cerrar */}
        <button 
          onClick={alCerrar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
        >
          ✕
        </button>
        
        {/* Aquí es donde "caerá" nuestro FormularioEditar */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};