import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Project IoT: 101')
    .setDescription(
      'IoT API Documentation for Project 101 - Users, Roles, Permissions, Devices, etc.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  // CORS
  app.enableCors();

  await app.listen(port);
}
bootstrap();
