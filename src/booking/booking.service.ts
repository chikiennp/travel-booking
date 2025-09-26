// booking.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from 'src/database/entities/booking.entity';
import { RoomEntity } from 'src/database/entities/room.entity';
import { BookingStatus, RoomStatus } from 'src/common/enums/status.enum';
import { ONE_DAY } from 'src/common/constants/daytime.constants';
import { BookingItemEntity } from 'src/database/entities/booking-item.entity';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { SeasonalPricingEntity } from 'src/database/entities/price.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(BookingItemEntity)
    private readonly bookingItemRepository: Repository<BookingItemEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(SeasonalPricingEntity)
    private readonly seasonalPricingRepository: Repository<SeasonalPricingEntity>,
  ) {}

  async createBooking(
    dto: CreateBookingDto,
    userId: string,
  ): Promise<BookingEntity> {
    const { checkIn, checkOut, guestCount } = dto;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const totalMultiplier = await this.getSeasonalMultiplier(
      checkInDate,
      checkOutDate,
    );

    const numberOfNights = Math.round(
      Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / ONE_DAY),
    );
    const discount = this.calculateDiscount(numberOfNights);

    let totalPrice = 0;
    const bookingItems: BookingItemEntity[] = [];
    for (const item of dto.items) {
      const room = await this.roomRepository.findOne({
        where: { id: item.roomId },
        select: ['id', 'price', 'status'],
      });
      if (!room) {
        throw new NotFoundException(ErrorMessage.ROOM_NOT_FOUND);
      }

      // check room status
      if (room.status !== RoomStatus.AVAILABLE) {
        throw new Error(`Room ${room.roomNumber} is currently not available`);
      }

      // check booking date
      const available = await this.isAvailable(
        room.id,
        checkInDate,
        checkOutDate,
      );
      if (!available) {
        throw new Error(
          `Room ${room.roomNumber} is already booked for this period`,
        );
      }

      if (!room.price || isNaN(room.price)) {
        throw new Error(`Room ${room.roomNumber} has invalid price`);
      }

      const basePrice = room.price * numberOfNights;
      const subTotal = basePrice * totalMultiplier * discount;

      totalPrice = totalPrice + subTotal;
      const newBookingItem = this.bookingItemRepository.create({
        room,
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

  async isAvailable(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const isOverlapping = await this.bookingItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.booking', 'booking')
      .where('item.roomId = :roomId', { roomId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      })
      .andWhere('booking.checkIn < :checkOut AND booking.checkOut > :checkIn', {
        checkIn,
        checkOut,
      })
      .getOne();

    return !isOverlapping;
  }

  private calculateDiscount(numberOfNights: number): number {
    if (numberOfNights >= 5) {
      return 0.9; // 10% discount
    }
    if (numberOfNights >= 3) {
      return 0.95; // 5% discount
    }
    return 1.0; // no discount
  }

  private async getSeasonalMultiplier(
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<number> {
    let totalMultiplier = 0;
    const numberOfNights = Math.round(
      Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / ONE_DAY),
    );
    if (numberOfNights) return 1;
    const seasonalRules = await this.seasonalPricingRepository.find();

    let currentDate = new Date(checkInDate);
    for (let i = 0; i < numberOfNights; i++) {
      let dailyMultiplier = 1.0;
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);

      const applicableRule = seasonalRules.find((rule) => {
        const start = new Date(rule.startDate);
        const end = new Date(rule.endDate);
        return currentDate >= start && currentDate < end;
      });

      if (applicableRule) {
        dailyMultiplier = Number(applicableRule.priceMultiplier) || 1.0;
      }

      totalMultiplier = totalMultiplier + dailyMultiplier;
      currentDate = nextDay;
    }

    return totalMultiplier / numberOfNights;
  }

  async updateStatus(
    id: string,
    hostId: string,
    status: BookingStatus,
  ): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) throw new NotFoundException(ErrorMessage.BOOKING_NOT_FOUND);
    booking.status = status;
    booking.updatedBy = hostId;

    return this.bookingRepository.save(booking);
  }

  async cancelBooking(
    bookingId: string,
    userId: string,
  ): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, user: { id: userId } },
      relations: ['user'],
    });
    if (!booking) {
      throw new NotFoundException(ErrorMessage.BOOKING_NOT_FOUND);
    }

    if (
      ![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status)
    ) {
      throw new BadRequestException(ErrorMessage.BOOKING_CANT_BE_CANCELLED);
    }

    booking.status = BookingStatus.CANCELED;
    booking.updatedBy = userId;
    booking.updatedAt = new Date();

    return this.bookingRepository.save(booking);
  }

  async softDelete(bookingId: string, userId: string): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException(ErrorMessage.BOOKING_NOT_FOUND);
    }

    booking.status = BookingStatus.CANCELED;
    booking.updatedBy = userId;
    booking.updatedAt = new Date();

    return this.bookingRepository.save(booking);
  }

  async hardDelete(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException(ErrorMessage.BOOKING_NOT_FOUND);
    }

    await this.bookingRepository.remove(booking);
  }
}
