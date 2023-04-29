import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { mock } from 'src/configs';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './schemas/tenant.schema';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    @InjectModel('tenants')
    private tenants: Model<Tenant, { id: string }>,
  ) { }

  create(body: CreateTenantDto) {
    // TODO: unit test
    return this.tenants.create(body);
  }

  overwrite(body: CreateTenantDto) {
    // TODO: unit test
    return this.tenants.create(body, { overwrite: true, return: 'item' });
  }

  findAll() {
    // TODO: unit test
    if (mock.enable) {
      return [mock.tenant];
    }
    return this.tenants.scan().exec();
  }

  findOne(id: string) {
    // TODO: unit test
    if (mock.enable) {
      return mock.tenant;
    }
    return this.tenants.get({ id });
  }

  update(id: string, body: UpdateTenantDto) {
    return `This action updates a #${id} tenant with ${body}`;
  }

  remove(id: string) {
    // TODO: unit test
    return this.tenants.delete({ id });
  }
}
