import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../db/task.entity';
import { EstadoTarea } from '../db/estado-tarea.entity';
import { Prioridad } from '../db/prioridad.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(EstadoTarea)
    private estadoRepository: Repository<EstadoTarea>,
    @InjectRepository(Prioridad)
    private prioridadRepository: Repository<Prioridad>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = new Task();
      task.titulo = createTaskDto.titulo;
      task.descripcion = createTaskDto.descripcion;
      task.fechaEntrega = createTaskDto.fechaEntrega;
      task.estadoId = 1; // Pendiente por defecto
      task.prioridadId = 1; // Prioridad por defecto
      
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }
}