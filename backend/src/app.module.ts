import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './db/task.entity';
import { EstadoTarea } from './db/estado-tarea.entity';
import { Prioridad } from './db/prioridad.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
      port: 5432,
      username: 'cris',
      password: '1234567',
      database: 'gestion_tareas_v1kx',
      entities: [Task, EstadoTarea, Prioridad],
      synchronize: false, // No crear tablas automáticamente
      ssl: {
        rejectUnauthorized: false
      },
      logging: false
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
