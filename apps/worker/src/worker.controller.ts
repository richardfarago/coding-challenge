import { Controller } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) { }

  //Request-response
  @MessagePattern('start')
  start(data: any) {
    console.log('Command arrived, fetching...')
    const url = data.url
    return this.workerService.start(url);
  }

  @MessagePattern('stop')
  end(data: any): string {
    const url = data.url
    return this.workerService.stop(url);
  }
}
