import { HttpService, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WorkerService {

  private intervalId: any = null
  constructor(
    @Inject('DATA_STREAMS') private client: ClientProxy,
    private httpService: HttpService
  ) { }

  start(url) {

    if (!this.intervalId) {
      //Immediate call since interval makes the first iteration after the timeout
      this.fetchAndEmit(url)
      this.intervalId = setInterval(async () => {
        this.fetchAndEmit(url)
      }, 300000)
      return 'Ok'
    }
    return 'Already fetching'
  }

  stop(): string {

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      return 'Ok'
    }
    return "Nothing to stop"
  }

  private async fetchAndEmit(url) {

    let response: any;
    response = await this.httpService.get('url').toPromise();
    this.client.emit('data', response.data);

  }
}
