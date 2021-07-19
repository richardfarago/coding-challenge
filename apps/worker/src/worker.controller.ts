import { Controller } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) { }

  //Request-response
  @MessagePattern('start')
  start(data: any): string {
    const url = data.url
    return this.workerService.start(url);
  }
}
