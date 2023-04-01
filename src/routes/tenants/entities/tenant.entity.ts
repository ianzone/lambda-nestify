import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Schema } from 'dynamoose';
import { SchemaDef } from 'src/utils';

class SDK {
  @ApiProperty()
  @IsString()
  key: string;
}

export class Tenant {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({isArray: true, type: String})
  @ValidateNested({ each: true })
  @Type(() => String)
  clientId: string[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SDK)
  @ApiProperty()
  sdk: SDK;
}

const tenant: SchemaDef<Tenant> = {
  id: {
    type: String,
    required: true,
    hashKey: true, // mark this property as the hash key
  },
  name: String,
  clientId: {
    type: Array,
    schema: [String],
  },
  sdk: {
    type: Object,
    schema: {
      key: String,
    },
  },
};

export const TenantSchema = new Schema(tenant);
