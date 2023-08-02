import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
  private logger = new Logger(ResourcesService.name);

  private items: Resource[] = [];

  create(userId: string, body: CreateResourceDto) {
    const item = new Resource({
      owner: userId,
      ...body,
    });
    this.items.push(item);
    return item;
  }

  overwrite(body: CreateResourceDto) {
    return `This action overwrites a resource ${JSON.stringify(body, null, 2)}`;
  }

  findAll(userId: string) {
    return this.items.filter((item) => item.owner === userId);
  }

  checkOne(id: string) {
    if (id !== 'asdf') {
      throw new NotFoundException();
    }
  }

  findOne(userId: string, id: string) {
    return this.items.find((item) => item.owner === userId && item.id === id);
  }

  update(id: string, body: UpdateResourceDto) {
    return `This action updates the #${id} resource with ${JSON.stringify(body, null, 2)}`;
  }

  remove(id: string) {
    return `This action removes the #${id} resource`;
  }
}
