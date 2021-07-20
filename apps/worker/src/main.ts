import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const context = await NestFactory.createApplicationContext(WorkerModule)
  const configService = context.get(ConfigService);

  const options = configService.get('rmq_worker_options');
  const transport = Transport.RMQ

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(WorkerModule, {

    transport: transport,
    options: options,

  });
  app.listen(async () => {
    console.log('Microservice is listening');
  });
}
bootstrap();
