import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' }) // <-- ¡ESTRICTO PARA US-08!
  description: string;

  @IsDateString({}, { message: 'La fecha límite debe ser válida' }) // <-- ¡ESTRICTO PARA US-08!
  dueDate: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  dificultad?: string;
}