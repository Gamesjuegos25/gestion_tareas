import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editarTareaSchema, type EditarTareaFormData } from '../schemas/editarTarea.schemas';

export const FormularioEditar = () => {
  // 1. Configuramos el formulario con React Hook Form y Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditarTareaFormData>({
    resolver: zodResolver(editarTareaSchema), // Conectamos Zod aquí
  });

  // 2. Esta función se ejecuta solo si los datos son válidos
  const alEnviar = (datos: EditarTareaFormData) => {
    console.log("Datos listos para enviar al backend:", datos);
    // Aquí es donde llamaremos a nuestro método PUT del backend después
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Editar Tarea (US-03)</h2>
      
      <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
        
        {/* Campo de Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            {...register("descripcion")} // Conectamos el input con Zod
            className={`w-full p-2 border rounded-md ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
          />
          {/* Mensaje de error si la validación falla */}
          {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
        </div>

        {/* Campo de Fecha Límite */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Límite</label>
          <input
            type="date"
            {...register("fechaLimite")}
            className={`w-full p-2 border rounded-md ${errors.fechaLimite ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fechaLimite && <p className="text-red-500 text-xs mt-1">{errors.fechaLimite.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};