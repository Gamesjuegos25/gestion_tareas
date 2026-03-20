import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitamos CORS para permitir la conexión con el Frontend (Vite)
  app.enableCors({
    origin: 'http://localhost:5173',
  });
  // Activar validación global de DTOs (class-validator)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidUnknownValues: true }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();