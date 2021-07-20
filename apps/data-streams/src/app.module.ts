import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '../../../config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'WORKER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        const options = configService.get('rmq_worker_options');
        const transport = Transport.RMQ

        return ClientProxyFactory.create({
          transport: transport,
          options: options,
        })
      }
    }
  ],
})
export class AppModule { }
