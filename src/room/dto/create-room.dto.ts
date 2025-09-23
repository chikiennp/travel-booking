import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

class BedDto {
  @IsString()
  type: string;

  @IsNumber()
  quantity: number;
}

export class CreateRoomDto {
  @IsString()
  roomTypeId: string;

  @IsString()
  roomNumber: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BedDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as BedDto;
        return plainToInstance(BedDto, parsed);
      } catch {
        return {};
      }
    }
    return value ? plainToInstance(BedDto, value) : {};
  })
  beds?: BedDto;

  @IsOptional()
  @IsString()
  features?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
