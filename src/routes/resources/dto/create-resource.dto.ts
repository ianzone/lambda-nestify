import { OmitType } from '@nestjs/swagger';
import { Resource } from '../entities/resource.entity';

export class CreateResourceDto extends OmitType(Resource, ['owner', 'id']) {}
