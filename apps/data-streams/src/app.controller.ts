import { Controller, Get, Post } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('start')
  start(): Observable<any> {
    console.log('Request arrived...')
    const data = { url: 'URL' }
    return this.appService.start(data)
  }

  @Post('stop')
  stop(): Observable<any> {
    const data = { url: 'URL' }
    return this.appService.stop(data)
  }

  @MessagePattern('data')
  saveResults() {
    return 'Saving data...'
  }
}
