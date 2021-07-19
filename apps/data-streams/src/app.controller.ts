import { Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  //Request-response
  @Post('')
  start(): Observable<any> {
    const data = { url: 'URL' }
    return this.appService.start(data)
  }
}
