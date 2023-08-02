import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { mock } from 'src/configs';
import { QueryUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('users')
    private users: Model<User, { id: string; tenantId: string }>,
  ) {}

  create(body: CreateUserDto) {
    return this.users.create(body);
  }

  overwrite(body: CreateUserDto) {
    return this.users.create(body, { overwrite: true, return: 'item' });
  }

  findAll(tenantId: string, query: QueryUserDto) {
    // TODO: add unit test
    if (mock.enable) {
      return [mock.user];
    }

    const res = this.users
      .query()
      .filter('tenantId')
      .eq(tenantId)
      .filter('name')
      .contains(query.name)
      .exec();

    return res;
  }

  checkOne(tenantId: string, id: string) {
    return this.getUser({ tenantId, id }, ['id']);
  }

  findOne(tenantId: string, id: string) {
    // TODO: add unit test
    return this.getUser({ tenantId, id });
  }

  async getUser(key: { tenantId: string; id: string }, attributes?: string[]) {
    if (mock.enable) {
      return mock.user;
    }

    let res: User;
    if (attributes?.length === 0) {
      res = await this.users.get(key);
    } else {
      res = await this.users.get(key, {
        return: 'item',
        attributes,
      });
    }

    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  update(tenantId: string, id: string, body: UpdateUserDto) {
    return `This action updates a #${id} user with ${JSON.stringify(body, null, 2)}`;
  }

  remove(tenantId: string, id: string) {
    return this.users.delete({ id, tenantId });
  }
}
