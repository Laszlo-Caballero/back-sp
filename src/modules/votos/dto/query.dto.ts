import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  nroMesa?: string;
}
