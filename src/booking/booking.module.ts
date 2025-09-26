import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from 'src/database/entities/booking.entity';
import { BookingItemEntity } from 'src/database/entities/booking-item.entity';
import { RoomEntity } from 'src/database/entities/room.entity';
import { SeasonalPricingEntity } from 'src/database/entities/price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      BookingItemEntity,
      RoomEntity,
      SeasonalPricingEntity,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
