import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Injectable()
export class WorkerService {

  constructor(@Inject('DATA_STREAMS') private client: ClientProxy) { }

  start(url) {
    //return "Start fetching: " + url
    console.log('Sending data...')
    return this.client.send('data', {})
  }

  stop(url): string {
    return "Stop fetching: " + url
  }
}
