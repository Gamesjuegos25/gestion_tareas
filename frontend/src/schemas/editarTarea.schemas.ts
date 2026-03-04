import { z } from 'zod';

export const editarTareaSchema = z.object({
  // Regla para la descripción
  descripcion: z
    .string()
    .min(20, "La descripción debe tener al menos 5 caracteres")
    .max(50, "La descripción es muy larga"),
    
  // Regla para la fecha límite
  fechaLimite: z
    .string()
    .min(1, "La fecha es obligatoria")
});

// Esto nos servirá para que TypeScript sepa qué forma tienen los datos
export type EditarTareaFormData = z.infer<typeof editarTareaSchema>;