import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Injectable()
export class WorkerService {

  private is_fetching: Boolean = false
  constructor(@Inject('DATA_STREAMS') private client: ClientProxy) { }

  async start(url) {

    if (this.is_fetching) {
      return "Already fetching"
    }

    this.is_fetching = true
    let interval = setInterval(async () => {

      console.log('Sending data...')
      this.client.emit('data', {})
      if (!this.is_fetching) {
        clearInterval(interval)
      }
    }, 6000)

    return 'Ok'
  }

  stop(url): string {
    this.is_fetching = false
    return "Stop fetching: " + url
  }
}
