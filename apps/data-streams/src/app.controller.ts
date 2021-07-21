import { Controller, Get, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { ExceptionsFilter } from './exception.filter';
import { ErrorsInterceptor } from './exception.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('start')
  @UseFilters(ExceptionsFilter)
  @UseInterceptors(ErrorsInterceptor)
  start(): Observable<any> {
    const data = { url: 'https://api.kanye.rest/' }
    return this.appService.start(data)
  }

  @Post('stop')
  stop(): Observable<any> {
    const data = { url: 'URL' }
    return this.appService.stop(data)
  }

  @Get('data')
  getData(): Promise<string[]> {
    return this.appService.getData()
  }

  @EventPattern('data')
  saveData(data: any): void {
    this.appService.saveData(data)
  }
}
