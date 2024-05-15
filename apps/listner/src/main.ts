import { NestFactory } from '@nestjs/core';
import { ListnerModule } from './listner.module';

async function bootstrap() {
  const app = await NestFactory.create(ListnerModule);
  await app.listen(3000);
}
bootstrap();
