import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitamos CORS para permitir la conexión con el Frontend (Vite)
  app.enableCors({
    origin: 'http://localhost:5173',
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();