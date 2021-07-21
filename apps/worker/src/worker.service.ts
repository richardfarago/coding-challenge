import { HttpService, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WorkerService {

  private intervalId: any = null
  constructor(
    @Inject('DATA_STREAMS') private client: ClientProxy,
    private httpService: HttpService
  ) { }

  start(url: string): any {

    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        this.fetchAndEmit(url)
      }, 300000)
      //Immediate call since interval makes the first iteration after the timeout
      return this.fetchAndEmit(url)
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

  private async fetchAndEmit(url: string): Promise<any> {

    return new Promise(async (resolve, reject) => {
      try {

        let response: any;
        response = await this.httpService.get(url).toPromise();
        await this.client.emit('data', response.data).toPromise();
        resolve('Ok')

      } catch (err) {
        reject(err)
      }
    })
  }
}
