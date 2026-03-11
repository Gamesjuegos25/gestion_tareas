import ilustracion from '../assets/ilustracion.png';

export const WelcomeCard = () => {
  return (
    <div className="bg-brand-light p-10 rounded-[40px] relative overflow-hidden flex items-center justify-between">
      <div className="relative z-10">
        <h2 className="text-2xl font-galilea font-horario-reg text-brand-dark">Hola, Mike</h2>
        <h1 className="text-4xl font-galilea font-tarea-bold text-brand-dark mb-4">Terminemos tus tareas hoy!</h1>
        <div className="bg-brand-dark text-brand-white px-8 py-2 rounded-full inline-block font-titan">Horario de hoy</div>
      </div>

      <div className="w-64 h-40 flex items-center justify-center">
        <img src={ilustracion} alt="Ilustración" className="h-full object-contain" />
      </div>
    </div>
  );
};