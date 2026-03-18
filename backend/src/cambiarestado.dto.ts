export enum Estado {
    PorHacer = 'To Do',
    EnProgreso = 'In Progress',
    Hecho = 'Done',
    }

    export enum Prioridad {
    Baja = 'Low',
    Media = 'Medium',
    Alta = 'High',
    }

    export class Tarea {
        id: number;
        titulo: string;
        descripcion: string;
        estado: Estado;
        prioridad: Prioridad;
        fechaLimite: string;
    }

    import {IsString, IsEnum, IsNotEmpty, IsDateString} from 'class-validator';

    export class CrearTareaDto {
        @IsString()
        @IsNotEmpty()
        titulo: string;
        @IsString()
        @IsNotEmpty()
        descripcion: string;
        @IsEnum(Prioridad)
        @IsNotEmpty()
        prioridad: Prioridad;
        @IsDateString()
        fechaLimite: string;
    }

    export class CambiarEstadoDto {
        @IsEnum(Estado)
        estado: Estado;
    }