import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('WORKER') private client: ClientProxy,
  ) { }

  start(data): Observable<any> {
    console.log('Sending command...')
    return this.client.send('start', data)
  }

  stop(data): Observable<any> {
    return this.client.send('stop', data)
  }
}
