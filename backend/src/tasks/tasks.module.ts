import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../db/task.entity';
import { EstadoTarea } from '../db/estado-tarea.entity';
import { Prioridad } from '../db/prioridad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, EstadoTarea, Prioridad])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}