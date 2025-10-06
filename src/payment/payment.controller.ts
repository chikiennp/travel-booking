import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentService } from './payment.service';
import { User } from 'src/common/decorators/user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(
    @User('sub') userId: string,
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (Array.isArray(ipAddr)) {
      ipAddr = ipAddr[0];
    }
    if (typeof ipAddr !== 'string') {
      ipAddr = '';
    }
    const url = await this.paymentService.createPaymentUrl(
      dto,
      userId,
      encodeURIComponent(ipAddr),
    );

    return { paymentUrl: url };
  }

  @Public()
  @Get('vnpay-return')
  async vnpayReturn(@Query() query: Record<string, string>) {
    return await this.paymentService.handleReturn(query, false);
  }

  @Get('vnpay-ipn')
  async vnpayIpn(@Query() query: Record<string, string>) {
    return this.paymentService.handleReturn(query, true);
  }
}
