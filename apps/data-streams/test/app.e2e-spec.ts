import { INestApplication, INestMicroservice } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { WorkerModule } from '../../worker/src/worker.module';
import { ConfigService } from '@nestjs/config';
import { WorkerService } from '../../worker/src/worker.service';
import { AppService } from '../src/app.service';

let configService: ConfigService;
let api: INestApplication;
let worker: INestMicroservice;
let workerService: WorkerService;
let appService: AppService
let workerClient: ClientProxy
let apiClient: ClientProxy

async function createApi() {
  const fixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
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
    ]
  }).compile();

  const app = fixture.createNestApplication();
  await app.init();

  configService = app.get(ConfigService)
  appService = app.get(AppService)
  workerClient = app.get('WORKER')

  app.connectMicroservice({ transport: Transport.RMQ, options: configService.get('rmq_datastream_options') })
  await app.startAllMicroservicesAsync();

  return app;
}

async function createWorker() {
  const fixture: TestingModule = await Test.createTestingModule({
    imports: [WorkerModule],
    providers: [
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
    ]
  }).compile();

  const app = fixture.createNestMicroservice({
    transport: Transport.RMQ,
    options: configService.get('rmq_worker_options')
  });


  await app.init()
  await app.listenAsync();

  workerService = app.get(WorkerService)
  apiClient = app.get('DATA_STREAMS')

  return app;
}

describe('e2e', () => {
  beforeAll(async () => {
    api = await createApi()
    worker = await createWorker()
    await apiClient.connect()
    await workerClient.connect()
  });

  afterAll(async () => {
    await apiClient.close()
    await workerClient.close()
    await api.close()
    await worker.close()
  });

  describe('Initialisation', () => {
    it('should be defined', () => {
      expect(api).toBeDefined()
    })
    it('should be defined', () => {
      expect(worker).toBeDefined()
    })
  })

  describe('Start fetching', () => {

    it(`/POST start`, async () => {
      jest.spyOn(appService, 'saveData')
      jest.spyOn(workerService, 'start')
      await request(api.getHttpServer())
        .post('/start')
        .expect(201)
        .expect('Ok')
      expect(appService.saveData).toHaveBeenCalled()
      expect(workerService.start).toHaveBeenCalled()
    });
  })

  describe('Stop fetching', () => {

    it(`/POST stop`, async () => {
      jest.spyOn(workerService, 'stop')
      await request(api.getHttpServer())
        .post('/stop')
        .expect(201)
        .expect('Ok')
      expect(workerService.stop).toHaveBeenCalled()
    });
  })

  describe('Get data', () => {

    it(`/GET data`, async () => {
      jest.spyOn(appService, 'getData')
      await request(api.getHttpServer()).post('/start')
      let response

      setTimeout(async () => {
        response = await request(api.getHttpServer()).get('/data').expect(200).then(res => res)
        expect(response.data).toBe(Array)
        expect(appService.getData).toHaveBeenCalled()

        await request(api.getHttpServer()).post('/stop')
      }, 2000)
    });
  })
});