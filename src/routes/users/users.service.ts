import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { settings } from 'src/configs';
import { ContextService } from 'src/services';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    @InjectModel(settings.usersTable)
    private users: Model<User, { id: string; tenantId: string }>,
    private readonly ctx: ContextService,
  ) {}

  create(body: CreateUserDto) {
    return this.users.create(body, { overwrite: true, return: 'document' });
  }

  findAll() {
    if (settings.mock) {
      return [mock];
    }
    const auth = this.ctx.auth;
    return this.users.query('tenantId').eq(auth.tenantId).exec();
  }

  async findOne(id: string) {
    if (settings.mock) {
      return mock;
    }
    const auth = this.ctx.auth;
    const cacheKey = `UsersServiceFindOne${id}`;
    let user = await this.cache.get<User>(cacheKey);
    if (!user) {
      this.logger.verbose('fetch user');
      user = await this.users.get({ id, tenantId: auth.tenantId });
      this.cache.set(cacheKey, user);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    const auth = this.ctx.auth;
    return this.users.delete({ id, tenantId: auth.tenantId });
  }
}

const mock: User = {
  tenantId: '',
  id: '',
  email: '',
  name: '',
};
