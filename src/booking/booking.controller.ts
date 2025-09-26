// booking.controller.ts
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/common/decorators/user.decorator';
import { BookingStatus } from 'src/common/enums/status.enum';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Auth(Role.CUSTOMER)
  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @User('sub') userId: string,
  ) {
    return this.bookingService.createBooking(createBookingDto, userId);
  }

  @Auth(Role.HOST)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @User('sub') hostId: string,
    @Body('status') status: BookingStatus,
  ) {
    return await this.bookingService.updateStatus(id, hostId, status);
  }

  @Auth(Role.CUSTOMER)
  @Delete(':id/cancel')
  async cancelBooking(
    @Param('id') bookingId: string,
    @User('sub') userId: string,
  ) {
    return this.bookingService.cancelBooking(bookingId, userId);
  }

  @Auth(Role.HOST)
  @Delete(':id/soft')
  async softDeleteBooking(
    @Param('id') bookingId: string,
    @User('sub') userId: string,
  ) {
    return this.bookingService.softDelete(bookingId, userId);
  }

  @Auth(Role.HOST)
  @Delete(':id/hard')
  async hardDeleteBooking(@Param('id') bookingId: string) {
    return this.bookingService.hardDelete(bookingId);
  }
}
