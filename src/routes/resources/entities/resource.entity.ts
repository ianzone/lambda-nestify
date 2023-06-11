import { ApiProperty } from '@nestjs/swagger';
import crypto from 'node:crypto';

interface IResource {
  sku: string;
  owner: string;
}

export class Resource implements IResource {
  constructor(data: IResource) {
    this.owner = data.owner;
    this.sku = data.sku;
    this.id = crypto.randomUUID();
  }

  @ApiProperty()
  owner: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  id: string;
}
