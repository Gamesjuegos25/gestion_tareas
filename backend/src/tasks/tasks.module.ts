import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- ¡Esta es la línea que falta! 🛠️
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
// (Si ya tienes importados aquí tu TasksController o TasksService, déjalos)

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController], // Si tenías algo aquí adentro, déjalo como estaba
  providers: [TasksService],   // Si tenías algo aquí adentro, déjalo como estaba
})
export class TasksModule {}
//import { TasksService } from './tasks.service';
//import { TasksController } from './tasks.controller';
  //controllers: [TasksController],
 // providers: [TasksService],