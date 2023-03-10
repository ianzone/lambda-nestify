import { Injectable, Logger } from '@nestjs/common';
import { MyDBService } from '../databases';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);
  constructor(private readonly db: MyDBService) {}

  async ormMethods(id: string) {
    this.logger.verbose({ ormMethods: id });
    this.db.get(id);
    return 'value';
  }
}
