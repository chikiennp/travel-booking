import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActiveStatus } from '../../common/enums/status.enum';

export class FilterPropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(ActiveStatus)
  status?: ActiveStatus;

  @IsOptional()
  @IsString()
  hostId?: string;

  // pagination
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsDateString()
  checkIn?: Date;

  @IsOptional()
  @IsDateString()
  checkOut?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  guests?: number;
}
