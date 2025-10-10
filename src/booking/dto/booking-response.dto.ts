import { BookingInfoDto } from './booking-info.dto';
import { BookingItemDto } from './booking-item.dto';

export class BookingDto {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPrice: number;
  status: string;
  items: BookingItemDto[];
  info: BookingInfoDto;
  createdAt: Date;
}
