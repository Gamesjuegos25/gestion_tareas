import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

// Importamos tus DTOs originales
import { EditarTareaDto } from '../editartarea.dto'; 
import { CrearTareaDto } from '../cambiarestado.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // ==========================================
  // US-03: LEER TODAS LAS TAREAS (GET)
  // ==========================================
  findAll() {
    return this.taskRepository.find();
  }

  // ==========================================
  // US-04: CREAR UNA NUEVA TAREA (POST)
  // ==========================================
  async create(datos: EditarTareaDto & { estado_id?: number, prioridad?: number }) {
    // 1. Creamos un molde en blanco de tu Entidad para evitar el error "DeepPartial"
    const nuevaTarea = new Task();
    
    // 2. Lo llenamos propiedad por propiedad de forma segura
    // Le ponemos un texto por defecto por si el DTO lo trae vacío al ser opcional
    nuevaTarea.titulo = datos.titulo || 'Nueva tarea'; 
    nuevaTarea.estado_id = datos.estado_id || 1; // "To Do" por defecto
    
    if (datos.descripcion) {
      nuevaTarea.descripcion = datos.descripcion;
    }
    
    if (datos.fechaLimite) {
      nuevaTarea.fecha_limite = new Date(datos.fechaLimite);
    }

    // 3. Guardamos en la nube de Render
    return await this.taskRepository.save(nuevaTarea);
  }

  // ==========================================
  // US-05: ACTUALIZAR Y MOVER TAREA (PATCH)
  // ==========================================
  async update(id: number, datos: EditarTareaDto & { estado_id?: number }) {
    // 1. Buscamos la tarea actual en Render
    const tareaActual = await this.taskRepository.findOneBy({ id });

    if (!tareaActual) {
      return null; // Si no existe, no hacemos nada
    }

    // 2. Preparamos el paquete de datos para guardar
    const datosParaGuardar: any = {};

    if (datos.titulo) {
      datosParaGuardar.titulo = datos.titulo;
    }

    if (datos.descripcion) {
      datosParaGuardar.descripcion = datos.descripcion;
    }

    // 3. ¡TU LÓGICA ORIGINAL DE VENCIMIENTO! ⏰
    if (datos.fechaLimite) {
      datosParaGuardar.fecha_limite = new Date(datos.fechaLimite);

      // Verificamos si ya venció
      const vencimientoTarea = new Date(datos.fechaLimite);
      const fechaActual = new Date();
      
      if (vencimientoTarea < fechaActual) {
        console.log(`⚠️ ALERTA: La tarea "${datos.titulo || tareaActual.titulo}" ya ha vencido.`);
      }
    }

    // 4. Lógica para cuando arrastras la tarjeta (cambio de estado)
    if (datos.estado_id) {
      datosParaGuardar.estado_id = datos.estado_id;
    }

    // 5. Guardamos los cambios en Render
    await this.taskRepository.update(id, datosParaGuardar);

    // 6. Devolvemos la tarea actualizada al Frontend
    return this.taskRepository.findOneBy({ id });
  }
}