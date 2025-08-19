import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors();
  
  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Aplicación NestJS ejecutándose en http://localhost:${port}`);
  console.log(`🌐 Conectado a Neon: ep-restless-night-ac56rgq8-pooler.sa-east-1.aws.neon.tech`);
  console.log(`📊 API de medicamentos disponible en http://localhost:${port}/medicamentos`);
}

bootstrap();
