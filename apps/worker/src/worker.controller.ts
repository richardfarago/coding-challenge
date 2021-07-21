import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UrlDto } from './url-data.dto';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) { }

  @MessagePattern('start')
  start(@Payload() data: UrlDto): any {
    const url: string = data.url
    return this.workerService.start(url);
  }

  @MessagePattern('stop')
  end(): string {
    console.log('Command arrived, stopping...')
    return this.workerService.stop();
  }
}
