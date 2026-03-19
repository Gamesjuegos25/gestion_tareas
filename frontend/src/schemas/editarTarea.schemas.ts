import { z } from 'zod';

export const editarTareaSchema = z.object({
  // -----modificacion para la descripción: trim + longitud + whitelist de caracteres (sin guiones)
  descripcion: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, { message: 'La descripción no puede estar vacía' })
    //.refine((s) => s.length >= 20, { message: 'La descripción debe tener al menos 20 caracteres' }) por rapidez de pruebas, se comenta esta regla.
    .refine((s) => s.length <= 50, { message: 'La descripción es muy larga' })
    .refine(
      (s) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ][A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-\.,:;?()]*$/.test(s),
      { message: 'La descripción debe empezar con una letra; no puede comenzar con número ni símbolo' }
    ),
//----------

  // Regla para la fecha límite
  fechaLimite: z
    .string()
    .min(1, 'La fecha es obligatoria')
});

// Esto nos servirá para que TypeScript sepa qué forma tienen los datos
export type EditarTareaFormData = z.infer<typeof editarTareaSchema>;