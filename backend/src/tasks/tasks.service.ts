import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

// Importamos tus DTOs (Asegúrate de que las rutas sean correctas según tu carpeta)
import { EditarTareaDto } from '../editartarea.dto'; 
import { CrearTareaDto } from '../cambiarestado.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // 1. LEER TODAS LAS TAREAS (Ordenadas por fecha de vencimiento)
  findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      order: { fecha_limite: 'ASC' },
    });
  }

  // 2. BUSCAR UNA TAREA POR ID
  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  // 3. CREAR UNA NUEVA TAREA (US-04)
  async create(datos: CrearTareaDto) {
    const nuevaTarea = new Task();
    
    nuevaTarea.titulo = datos.titulo || 'Nueva tarea'; 
    nuevaTarea.estado_id = 1; // "To Do" por defecto
    
    if (datos.descripcion) {
      nuevaTarea.descripcion = datos.descripcion;
    }
    
    if (datos.fechaLimite) {
      nuevaTarea.fecha_limite = new Date(datos.fechaLimite); 
    }

    return await this.taskRepository.save(nuevaTarea);
  }

  // 4. ACTUALIZAR Y MOVER TAREA (US-03 / US-05)
  async update(id: number, datos: EditarTareaDto & { estado_id?: number }) {
    const tareaActual = await this.taskRepository.findOneBy({ id });

    if (!tareaActual) return null;

    const datosParaGuardar: any = {};

    if (datos.titulo) datosParaGuardar.titulo = datos.titulo;
    if (datos.descripcion) datosParaGuardar.descripcion = datos.descripcion;

    // Lógica de vencimiento unificada
    if (datos.fechaLimite) {
      datosParaGuardar.fecha_limite = new Date(datos.fechaLimite);

      const vencimientoTarea = new Date(datos.fechaLimite);
      const fechaActual = new Date();
      
      if (vencimientoTarea < fechaActual) {
        console.log(`⚠️ ALERTA: La tarea "${datos.titulo || tareaActual.titulo}" ya ha vencido.`);
      }
    }

    // Lógica para cambio de estado (Drag & Drop)
    if (datos.estado_id) {
      datosParaGuardar.estado_id = datos.estado_id;
    }

    await this.taskRepository.update(id, datosParaGuardar);
    return this.taskRepository.findOneBy({ id });
  }

  // 5. ELIMINAR TAREA
  async remove(id: number) {
    await this.taskRepository.delete(id);
    return { deleted: true };
  }
}