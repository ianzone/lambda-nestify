import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { settings } from 'src/configs';
import { ContextService } from 'src/services';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    @InjectModel(settings.tenantsTable)
    private tenants: Model<Tenant, { id: string }>,
    private readonly ctx: ContextService,
  ) {}

  create(createTenantDto: CreateTenantDto) {
    return 'This action adds a new tenant';
  }

  findAll() {
    if (settings.mock) {
      return [mock];
    }
    const auth = this.ctx.auth;
    return this.tenants.query('id').eq(auth.tenantId).exec();
  }

  async findOne(id: string): Promise<Tenant> {
    if (settings.mock) {
      return mock;
    }
    const cacheKey = `TenantsServiceFindOne${id}`;
    let tenant = await this.cache.get<Tenant>(cacheKey);
    if (!tenant) {
      this.logger.verbose('fetch tenant');
      tenant = await this.tenants.get({ id });
      this.cache.set(cacheKey, tenant);
    }
    return tenant;
  }

  update(id: string, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: string) {
    return this.tenants.delete({ id });
  }
}

const mock: Tenant = {
  id: '',
  name: '',
  clientId: [''],
  sdk: {
    key: '',
  },
};
