import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
// Importamos Horario para asegurar que TypeORM lo reconozca en el ciclo de carga
import { Horario } from './tasks/entities/horario.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
      port: 5432,
      username: 'mike',
      password: '123',
      database: 'gestion_tareas_v1kx',
      autoLoadEntities: true, // Esto cargará Task y Horario automáticamente
      synchronize: false,    // Mantenlo en false ya que tu tabla ya existe en Render
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