import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  create(body: CreateResourceDto) {
    return `This action adds a new resource ${body}`;
  }

  overwrite(body: CreateResourceDto) {
    return `This action overwrites a resource ${body}`;
  }

  findAll() {
    return 'This action returns all resources';
  }

  checkOne(id: string) {
    if (id !== 'asdf') {
      throw new NotFoundException
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
