import { HttpModule, Module, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import config from '../../../config'
import { APP_PIPE } from '@nestjs/core';

const validationOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  disableErrorMessages: false,
  stopAtFirstError: true,
  transform: true, //--> Transform request object into the desired entity type + conversion of primitive types
  //skipMissingProperties: true //--> Only validate present properties
}

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
  ],
  controllers: [WorkerController],
  providers: [
    WorkerService,
    {
      provide: 'DATA_STREAMS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        const options = configService.get('rmq_datastream_options');
        const transport = Transport.RMQ

        return ClientProxyFactory.create({
          transport: transport,
          options: options,
        })
      }
    },
    { provide: APP_PIPE, useValue: new ValidationPipe(validationOptions) },
  ]
})
export class WorkerModule { }
