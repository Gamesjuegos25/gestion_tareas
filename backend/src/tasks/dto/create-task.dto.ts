import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'; // <-- IMPORTANTE: Necesitamos esto para objetos anidados

// 1. DTO SECUNDARIO: Define cómo debe venir cada bloque de horario
export class HorarioDto {
  @IsDateString({}, { message: 'La hora de inicio debe ser una fecha/hora válida (ISO)' })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  inicio: string;

  @IsDateString({}, { message: 'La hora de fin debe ser una fecha/hora válida (ISO)' })
  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  fin: string;

  @IsString()
  @IsOptional()
  tipo?: string;
}

// 2. TU DTO PRINCIPAL (Intacto, solo le agregamos el arreglo al final)
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' }) // <-- ¡ESTRICTO PARA US-08!
  description: string;

  @IsDateString({}, { message: 'La fecha límite debe ser válida' })
  @IsNotEmpty({ message: 'La fecha límite es obligatoria' }) // <-- ¡ESTRICTO PARA US-08!
  dueDate: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  dificultad?: string;

  @IsNumber()
  @IsOptional()
  prioridad_id?: number;

  // 👇 3. MAGIA: ARREGLO DE HORARIOS VALIDADO 👇
  @IsArray({ message: 'Los horarios deben enviarse como una lista (arreglo)' })
  @IsOptional() // Opcional porque tal vez creas una tarea sin agendarla aún
  @ValidateNested({ each: true }) // Le dice a NestJS: "Revisa cada elemento de este arreglo"
  @Type(() => HorarioDto) // Le dice a NestJS: "Cada elemento debe cumplir con las reglas de HorarioDto"
  horarios?: HorarioDto[];
}