import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/database/entities/payment.entity';
import { BookingEntity } from 'src/database/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, BookingEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
