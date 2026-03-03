import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
      port: 5432,
      username: 'anibal',
      password: '12345',
      database: 'gestion_tareas_v1kx',
      entities: [Task],
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    }),
    TasksModule,
  ],
})
export class AppModule {}