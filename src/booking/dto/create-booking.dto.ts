// dto/create-booking.dto.ts
import {
  IsDateString,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BookingItemDto {
  @IsUUID()
  roomId: string;
}

export class BookingInfoDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateBookingDto {
  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsNumber()
  guestCount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingItemDto)
  items: BookingItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BookingInfoDto)
  info?: BookingInfoDto;
}
