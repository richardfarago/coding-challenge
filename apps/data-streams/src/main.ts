import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const initMicroservice = async (app: INestApplication) => {

  const configService = app.get(ConfigService);

  const options = configService.get('rmq_datastream_options');
  const transport = Transport.RMQ

  app.connectMicroservice({

    transport: transport,
    options: options

  }, {});

  await app.startAllMicroservicesAsync();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initMicroservice(app);
  await app.listen(3000, () => {
    console.log('App is listening')
  });
}
bootstrap();
