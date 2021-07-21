import { INestApplication, INestMicroservice } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Transport } from '@nestjs/microservices';
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

async function createApi() {
  const fixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  const app = fixture.createNestApplication();
  await app.init();

  configService = app.get(ConfigService)
  appService = app.get(AppService)

  app.connectMicroservice({ transport: Transport.RMQ, options: configService.get('rmq_datastream_options') })
  await app.startAllMicroservicesAsync();

  return app;
}

async function createWorker() {
  const fixture: TestingModule = await Test.createTestingModule({
    imports: [WorkerModule],
  }).compile();

  const app = fixture.createNestMicroservice({
    transport: Transport.RMQ,
    options: configService.get('rmq_worker_options')
  });

  await app.init()
  await app.listenAsync();
  workerService = app.get(WorkerService)

  return app;
}

describe('e2e', () => {
  beforeAll(async () => {
    api = await createApi()
    worker = await createWorker()
  });

  afterAll(async () => {
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

    it(`/POST start`, () => {
      return request(api.getHttpServer())
        .post('/start')
        .expect(201)
        .expect('Ok')
    });

    it(`should have been called`, async () => {
      jest.spyOn(workerService, 'start')
      await request(api.getHttpServer()).post('/start')
      expect(workerService.start).toHaveBeenCalled()
    });

    it(`should have been called`, async () => {
      jest.spyOn(appService, 'saveData')
      await request(api.getHttpServer()).post('/start')
      expect(appService.saveData).toHaveBeenCalled()
    });

  })

  describe('Stop fetching', () => {

    it(`/POST stop`, () => {
      return request(api.getHttpServer())
        .post('/stop')
        .expect(201)
        .expect('Ok')
    });

    it(`should have been called`, async () => {
      jest.spyOn(workerService, 'stop')
      await request(api.getHttpServer()).post('/stop')
      expect(workerService.start).toHaveBeenCalled()
    });
  })

  // describe('Get data', () => {

  //   it(`/GET data`, async () => {
  //     let response = await request(api.getHttpServer())
  //       .get('/data')
  //       .expect(200)
  //       .then(res => res)

  //     console.log(response)
  //     expect(response).toBe(Array)
  //   });

  // })
});