import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ContextService } from 'src/services';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  private logger = new Logger(ResourcesService.name);
  constructor(private readonly ctx: ContextService) {}

  create(body: CreateResourceDto) {
    return `This action adds a new resource ${body}`;
  }

  overwrite(body: CreateResourceDto) {
    return `This action overwrites a resource ${body}`;
  }

  findAll() {
    return 'This action returns all resources of the user ' + this.ctx.user.name;
  }

  checkOne(id: string) {
    if (id !== 'asdf') {
      throw new NotFoundException();
    }
  }

  findOne(id: string) {
    return `This action returns the #${id} resource`;
  }

  update(id: string, body: UpdateResourceDto) {
    return `This action updates the #${id} resource with ${body}`;
  }

  remove(id: string) {
    return `This action removes the #${id} resource`;
  }
}
