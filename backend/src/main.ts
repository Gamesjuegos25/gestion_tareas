import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ¡Agrega esta línea para darle permiso a tu frontend!
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
