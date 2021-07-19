import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class WorkerService {

  start(url): string {
    return "I will start fetching: " + url
  }
}
