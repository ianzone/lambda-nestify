import { Injectable } from '@nestjs/common';
import { delay } from 'src/utils';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    await delay();
    return 'Hello World!';
  }
}
