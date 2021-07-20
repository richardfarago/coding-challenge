import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {

  private data: any[] = []

  constructor(
    @Inject('WORKER') private client: ClientProxy,
  ) { }

  start(data): Observable<any> {
    return this.client.send('start', data)
  }

  stop(data): Observable<any> {
    return this.client.send('stop', data)
  }

  saveData(data) {
    this.data.push(data)
    console.log(this.data)
  }
}
