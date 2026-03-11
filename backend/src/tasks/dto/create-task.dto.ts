import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  dificultad?: string;
}