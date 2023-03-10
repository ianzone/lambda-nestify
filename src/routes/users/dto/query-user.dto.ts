import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  age?: number;
}
