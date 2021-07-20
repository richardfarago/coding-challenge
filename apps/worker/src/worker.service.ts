import { HttpService, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WorkerService {

  private is_fetching: Boolean = false
  constructor(
    @Inject('DATA_STREAMS') private client: ClientProxy,
    private httpService: HttpService
  ) { }

  async start(url) {

    //Return if interval is already executing
    if (this.is_fetching) {
      return "Already fetching"
    }

    let response: any

    //Initial call immediately
    response = await this.httpService.get(url).toPromise()
    await this.client.emit('data', response.data)

    this.is_fetching = true
    let interval = setInterval(async () => {

      //Stop fetching if is_fetching is false
      if (!this.is_fetching) {
        clearInterval(interval)
      }

      response = await this.httpService.get(url).toPromise()
      await this.client.emit('data', response.data)

    }, 300000)

    return 'Ok'
  }

  stop(): string {
    this.is_fetching = false
    return "Ok"
  }
}
