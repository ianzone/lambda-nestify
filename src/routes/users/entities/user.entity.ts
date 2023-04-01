import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Schema } from 'dynamoose';
import { SchemaDef } from 'src/utils';

export class User {
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

const user: SchemaDef<User> = {
  tenantId: {
    type: String,
    required: true,
    hashKey: true,
  },
  id: {
    type: String,
    required: true,
    rangeKey: true,
  },
  email: String,
  name: String,
};

export const UserSchema = new Schema(user);
