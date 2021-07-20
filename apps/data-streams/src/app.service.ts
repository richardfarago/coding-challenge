import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Cache } from 'cache-manager'

@Injectable()
export class AppService {

  private data: any[] = []

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

  saveData(data) {
    this.data.push(data.quote)
    this.cacheManager.set('api-data', this.data)
  }
}
