import { NestFactory } from '@nestjs/core';
import { ListnerModule } from './listner.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ListnerModule,
    {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://127.0.0.1:1883',
        
      },
      autoFlushLogs: true,
    },
  );
  await app.listen();
}
bootstrap();
