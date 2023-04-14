import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { SDK, Tenant, Url } from '../schemas/tenant.schema';

class SdkDto implements SDK {
  @ApiProperty()
  @IsString()
  key: string;
}

class UrlDto implements Url {
  @ApiProperty()
  @IsString()
  apps: string;

  @ApiProperty()
  @IsString()
  portal: string;

  @ApiProperty()
  @IsString()
  terms: string;

  @ApiProperty()
  @IsString()
  privacy: string;
}
export class CreateTenantDto implements Tenant {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({isArray: true, type: String})
  @IsString({ each: true })
  clientId: string[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => UrlDto)
  url: UrlDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SdkDto)
  sdk: SdkDto;
}
