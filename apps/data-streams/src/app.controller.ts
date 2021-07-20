import { Controller, Get, Post } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('start')
  start(): Observable<any> {
    const data = { url: 'https://api.kanye.rest/' }
    return this.appService.start(data)
  }

  @Post('stop')
  stop(): Observable<any> {
    const data = { url: 'URL' }
    return this.appService.stop(data)
  }

  @EventPattern('data')
  saveData(data: any) {
    return this.appService.saveData(data)
  }
}
