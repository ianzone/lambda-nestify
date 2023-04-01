import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class QueryUserDto extends PartialType(CreateUserDto) {}
