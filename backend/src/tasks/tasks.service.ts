import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

// Importaciones de la lógica manual (HEAD)
import { CrearTareaDto } from 'src/cambiarestado.dto';
import { Tarea, Estado, Prioridad } from 'src/cambiarestado.dto';
import { EditarTareaDto } from 'src/editartarea.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  // Lógica integrada de tu compañero para listar desde PostgreSQL
  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      order: { fecha_limite: 'ASC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

// Conservamos la clase TareasService para no perder la lógica de validación de fechas
// Nota para el equipo: Esta lógica deberá migrarse al TasksService principal usando TypeORM después.
export class TareasService {
  private tareas: Tarea[] = [];

  create( datos : CrearTareaDto): Tarea {
   const nuevaTarea: Tarea = {
    id: this.tareas.length + 1,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    prioridad: datos.prioridad,
    fechaLimite: new Date().toISOString(),
    estado: Estado.PorHacer,
    };
    this.tareas.push(nuevaTarea);
    return nuevaTarea;
  }

  actualizarTarea(id: number, datos: EditarTareaDto): Tarea | null {
    const tareaActual = this.tareas.find(tarea => tarea.id === id);
    if (tareaActual) {
      if (datos.descripcion) {
        tareaActual.descripcion = datos.descripcion;
      }
      if (datos.fechaLimite) {
        tareaActual.fechaLimite = datos.fechaLimite;
      }

      const vencimientoTarea = new Date(tareaActual.fechaLimite);
      const fechaActual = new Date();
      if (vencimientoTarea < fechaActual) {
        console.log (`La tarea "${tareaActual.titulo}" ha vencido.`);
      }

      if (datos.titulo) {
        tareaActual.titulo = datos.titulo;
      }
      return tareaActual;
    }
    return null;
  }
}