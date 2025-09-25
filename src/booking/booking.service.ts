// booking.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from 'src/database/entities/booking.entity';
import { RoomEntity } from 'src/database/entities/room.entity';
import { BookingStatus } from 'src/common/enums/status.enum';
import { ONE_DAY } from 'src/common/constants/daytime.constants';
import { BookingItemEntity } from 'src/database/entities/booking-item.entity';
import { ErrorMessage } from 'src/common/enums/message.enums';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(BookingItemEntity)
    private readonly bookingItemRepository: Repository<BookingItemEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createBooking(
    dto: CreateBookingDto,
    userId: string,
  ): Promise<BookingEntity> {
    const { checkIn, checkOut, guestCount } = dto;
    let totalPrice = 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfNights = Math.round(
      Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / ONE_DAY),
    );

    const bookingItems: BookingItemEntity[] = [];
    for (const item of dto.items) {
      const room = await this.roomRepository.findOne({
        where: { id: item.roomId },
        select: ['id', 'price'],
      });
      if (!room) {
        throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);
      }

      const subTotal = room.price * numberOfNights * (item.quantity || 1);
      totalPrice += subTotal;
      const newBookingItem = this.bookingItemRepository.create({
        room,
        quantity: item.quantity,
        pricePerNight: room.price,
        nights: numberOfNights,
        subTotal,
        createdBy: userId,
      });
      bookingItems.push(newBookingItem);
    }

    const newBooking = {
      user: { id: userId },
      checkIn,
      checkOut,
      guestCount,
      items: bookingItems,
      totalPrice,
      status: BookingStatus.PENDING,
      createdBy: userId,
    };

    return this.bookingRepository.save(newBooking);
  }
}
