import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { User } from '../schemas/user.schema';

export class CreateUserDto implements User {
  @ApiProperty({
    description: 'the partition key',
  })
  @IsString()
  tenantId: string;

  @ApiProperty({
    description: 'the sort key',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Sign up email',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'Ian',
  })
  @IsString()
  name: string;
}
