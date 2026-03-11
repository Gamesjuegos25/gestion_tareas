<<<<<<< HEAD
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
=======
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Lógica de inserción (persistencia) — se conecta a la DB vía Prisma
  // 1) Busca el id del estado "Pendiente" en la tabla `estados_tarea`
  // 2) Crea un registro en `tareas` con los campos recibidos y `estado_id`
  // 3) Devuelve una representación simple de la tarea creada
  async create(dto: Partial<Task>): Promise<Task> {
    try {
    // Buscar el estado por nombre (Pendiente) — usado como estado por defecto
    const pendiente = await this.prisma.estados_tarea.findFirst({ where: { nombre: 'Pendiente' } });

    // Crear la tarea en la tabla `tareas` usando Prisma Client
    const created = await this.prisma.tareas.create({
      data: {
        titulo: dto.title ?? 'Sin título',
        descripcion: dto.description ?? '',
        fecha_limite: dto.dueDate ? new Date(dto.dueDate) : new Date(),
        estado_id: pendiente?.id,
      },
      include: { estados_tarea: true },
    });

    // Mapear el resultado a la interfaz `Task` usada por la API
    return {
      id: Number(created.id),
      title: created.titulo,
      description: created.descripcion,
      completed: created.estados_tarea?.nombre === 'Completado',
      dueDate: created.fecha_limite.toISOString().slice(0, 10),
    };
    import { Injectable, InternalServerErrorException } from '@nestjs/common';
    import { PrismaService } from '../prisma/prisma.service';
    import { Task } from './entities/task.entity';

    @Injectable()
    export class TasksService {
      constructor(private readonly prisma: PrismaService) {}

      async findAll(): Promise<Task[]> {
        const rows = await this.prisma.tareas.findMany({ include: { estados_tarea: true } });
        return rows.map((r) => ({
          id: Number(r.id),
          title: r.titulo,
          description: r.descripcion,
          completed: r.estados_tarea?.nombre === 'Completado',
          dueDate: r.fecha_limite ? r.fecha_limite.toISOString().slice(0, 10) : '',
        }));
      }

      // Lógica de inserción (persistencia) — se conecta a la DB vía Prisma
      async create(dto: Partial<Task>): Promise<Task> {
        try {
          const pendiente = await this.prisma.estados_tarea.findFirst({ where: { nombre: 'Pendiente' } });

          const created = await this.prisma.tareas.create({
            data: {
              titulo: (dto.title as any) ?? 'Sin título',
              descripcion: (dto.description as any) ?? '',
              fecha_limite: dto.dueDate ? new Date(dto.dueDate as any) : new Date(),
              estado_id: pendiente?.id,
            },
            include: { estados_tarea: true },
          });

          return {
            id: Number(created.id),
            title: created.titulo,
            description: created.descripcion,
            completed: created.estados_tarea?.nombre === 'Completado',
            dueDate: created.fecha_limite.toISOString().slice(0, 10),
          };
        } catch (err) {
          console.error('Error creating task:', err);
          throw new InternalServerErrorException('Error al crear la tarea, revise la configuración de la base de datos');
        }
    >>>>>>> e98030c (Cambios para US-01)