import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class BedDto {
  @IsString()
  type: string;

  @IsNumber()
  quantity: number;
}

export class CreateRoomTypeDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  capacity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BedDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as BedDto[];
        // convert plain object -> instance
        return plainToInstance(BedDto, parsed);
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? plainToInstance(BedDto, value) : [];
  })
  beds?: BedDto[];
}
