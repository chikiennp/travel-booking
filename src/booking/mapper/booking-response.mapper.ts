import { BookingEntity } from 'src/database/entities/booking.entity';
import { BookingDto } from '../dto/booking-response.dto';
import { BookingInfoDto } from '../dto/booking-info.dto';
import { BookingItemDto } from '../dto/booking-item.dto';
import { BookingInfo } from 'src/database/entities/booking-info.entity';
import { BookingItemEntity } from 'src/database/entities/booking-item.entity';

export class BookingMapper {
  private static mapBookingInfoToDto = (info: BookingInfo): BookingInfoDto => {
    return {
      ...(info?.firstName && { firstName: info.firstName }),
      ...(info?.lastName && { lastName: info.lastName }),
      ...(info?.email && { email: info.email }),
      ...(info?.phone && { phone: info.phone }),
    };
  };

  static mapBookingItemToDto = (item: BookingItemEntity): BookingItemDto => {
    return {
      room: {
        roomId: item.room.id,
        roomNumber: item.room.roomNumber,
      },
    };
  };

  static mapBookingToDto(booking: BookingEntity): BookingDto {
    return {
      id: booking.id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestCount: booking.guestCount,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
      info: BookingMapper.mapBookingInfoToDto(booking.info),
      items: booking.items.map(BookingMapper.mapBookingItemToDto),
    };
  }
}
