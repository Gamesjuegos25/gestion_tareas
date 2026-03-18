import { IsDateString, IsOptional, IsString, IsNotEmpty, IsNumber } from "class-validator";

export class EditarTareaDto {
    // A diferencia de editar, al crear una tarea el título SÍ es obligatorio
    @IsString()
    @IsNotEmpty() 
    titulo: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsDateString()
    @IsOptional()
    fechaLimite?: string; // ¡Esta es la línea mágica que apaga el error rojo! ✨

    @IsNumber()
    @IsOptional()
    prioridad?: number;

    @IsNumber()
    @IsOptional()
    estado_id?: number;
}