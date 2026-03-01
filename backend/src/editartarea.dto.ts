import { IsDateString, IsOptional, IsString } from "class-validator";

export class EditarTareaDto {
    @IsString()
    @IsOptional()
    titulo?: string;

    @IsDateString()
    @IsOptional()
    fechaLimite?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;
}