import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { Horario } from './entities/horario.entity'; 
// 👇 1. IMPORTAMOS LA ENTIDAD DE FLUJO
import { FlujoTarea } from './entities/flujo-tarea.entity'; 

@Module({
  // 👇 2. LA AGREGAMOS AL REPOSITORIO DEL MÓDULO
  imports: [TypeOrmModule.forFeature([Task, Horario, FlujoTarea])], 
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}