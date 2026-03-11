import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importamos TypeORM
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // 2. Agregamos la configuración de tu base de datos en Render
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
      port: 5432,
      username: 'mike',       // <-- Reemplaza esto con tu usuario
      password: '123',    // <-- Reemplaza esto con tu contraseña
      database: 'gestion_tareas_v1kx',
      autoLoadEntities: true,            // Carga los moldes (entidades) automáticamente
      synchronize: false,                // Las tablas ya existen en la BD remota
      ssl: true,                         // <-- Requerido para conectarse a Render
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    // 3. Tu módulo de tareas se queda aquí mismo
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}