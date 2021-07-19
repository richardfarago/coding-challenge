import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('WORKER') private client: ClientProxy,
  ) { }

  start(data): Observable<any> {
    //Send message to microservice 
    return this.client.send('start', data)
  }
}
