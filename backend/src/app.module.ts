import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
      port: 5432,
      username: 'mike', // Asegúrate de que estas sean las credenciales correctas
      password: '123',
      database: 'gestion_tareas_v1kx',
      autoLoadEntities: true, 
      synchronize: false,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}