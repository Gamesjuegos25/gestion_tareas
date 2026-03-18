import logoGato from '../assets/logo.png'; // <-- Verifica que el nombre coincida

export const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', active: true },
    { name: 'Task', active: false },
    { name: 'Project', active: false },
    { name: 'Horario', active: false },
  ];

  return (
    <aside className="w-64 h-full border-r-2 border-brand-dark flex flex-col items-center py-10">
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-16">
        <img src={logoGato} alt="Task Logo" className="w-40 object-contain" />
      </div>

      {/* MENÚ */}
      <nav className="w-full space-y-4 px-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center gap-4 py-3 px-6 rounded-r-full cursor-pointer transition-all ${
              item.active 
                ? 'bg-brand-yellow text-brand-dark -ml-4 border-l-8 border-brand-dark pl-8' 
                : 'text-brand-dark hover:bg-brand-light'
            }`}
          >
            <span className="font-galilea font-tarea-bold text-lg">{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};