import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from 'src/configs';

@Injectable()
export class MyDBService {
  private readonly logger = new Logger(MyDBService.name);
  constructor(private readonly config: ConfigService<Configs, true>) {}

  async get(id: string) {
    return 'the value of' + id;
  }

  async put(id: string, data: any) {
    this.logger.verbose('put', { id, data });
  }

  async delete(id: string) {
    this.logger.verbose('delete', { id });
  }
}
