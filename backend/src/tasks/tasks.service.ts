import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  findAll() {
    return `This action returns all tasks`;
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

import { CrearTareaDto } from 'src/cambiarestado.dto';
import {Tarea, Estado, Prioridad} from 'src/cambiarestado.dto';
 import { EditarTareaDto } from 'src/editartarea.dto';

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



