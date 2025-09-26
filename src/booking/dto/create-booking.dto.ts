// dto/create-booking.dto.ts
import {
  IsDateString,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BookingItemDto {
  @IsUUID()
  roomId: string;
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
}
