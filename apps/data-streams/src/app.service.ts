import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Cache } from 'cache-manager'

@Injectable()
export class AppService {

  constructor(
    @Inject('WORKER') private client: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  start(data): Observable<any> {
    return this.client.send('start', data)
  }

  stop(data): Observable<any> {
    return this.client.send('stop', data)
  }

  async saveData(data: any): Promise<void> {
    let array: string[] = await this.cacheManager.get('api-data') || []
    array.push(data.quote)
    this.cacheManager.set('api-data', array)
  }

  getData(): Promise<string[]> {
    return this.cacheManager.get('api-data')
  }
}
