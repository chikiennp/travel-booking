/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/database/entities/payment.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';
import { PaymentStatus } from 'src/common/enums/status.enum';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BookingEntity } from 'src/database/entities/booking.entity';
import { ErrorMessage } from 'src/common/enums/message.enums';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(BookingEntity)
    private bookingRepo: Repository<BookingEntity>,
  ) {}

  async createPaymentUrl(
    dto: CreatePaymentDto,
    userId: string,
    ipAddr: string,
  ) {
    const booking = await this.bookingRepo.findOne({
      where: { id: dto.bookingId, user: { id: userId } },
    });
    if (!booking) {
      throw new NotFoundException(ErrorMessage.BOOKING_NOT_FOUND);
    }

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const payment = this.paymentRepo.create({
      booking,
      amount: booking.totalPrice,
      currency: 'VND',
      status: PaymentStatus.PENDING,
      paymentMethod: 'VNPAY',
      createdBy: userId,
      transactionId: orderId,
    });
    await this.paymentRepo.save(payment);

    const vnp_TmnCode = this.configService.get<string>('VNP_TMN_CODE')?.trim();
    if (!vnp_TmnCode) {
      throw new Error('VNP_TMN_CODE is not defined in configuration');
    }

    const vnp_HashSecret = this.configService
      .get<string>('VNP_HASH_SECRET')!
      .trim();
    const vnp_Url = this.configService.get<string>('VNP_URL');
    const vnp_ReturnUrl = this.configService.get<string>('VNP_RETURN_URL');
    if (!vnp_ReturnUrl) {
      throw new Error('VNP_RETURN_URL is not defined in configuration');
    }

    let params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'PaymentForBooking',
      vnp_OrderType: 'other',
      vnp_Amount: booking.totalPrice * 100,
      vnp_ReturnUrl: encodeURIComponent(vnp_ReturnUrl),
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };
    params = this.sortObject(params);
    const signData = qs.stringify(params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    params.vnp_SecureHash = signed;
    const queryString = qs.stringify(params, { encode: false });

    return `${vnp_Url}?${queryString}`;
  }

  async handleReturn(query: Record<string, string>, isIpn = false) {
    const vnp_HashSecret = this.configService.get<string>('VNP_HASH_SECRET')!;
    const secureHash = query['vnp_SecureHash'];
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];

    const signData = qs.stringify(this.sortObject(query), { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const orderId = query['vnp_TxnRef'];
      const rspCode = query['vnp_ResponseCode'];

      const payment = await this.paymentRepo.findOne({
        where: { transactionId: orderId },
      });
      if (payment) {
        payment.status =
          rspCode === '00' ? PaymentStatus.PAID : PaymentStatus.FAILED;
        await this.paymentRepo.save(payment);
      }

      if (isIpn) {
        return {
          RspCode: rspCode === '00' ? '00' : rspCode,
          Message: rspCode === '00' ? 'Confirm Success' : 'Payment Failed',
        };
      } else {
        return { message: 'OK', code: rspCode };
      }
    } else {
      if (isIpn) {
        return { RspCode: '97', Message: 'Invalid Signature' };
      } else {
        return { message: 'Invalid signature', code: '97' };
      }
    }
  }

  private sortObject<T extends Record<string, unknown>>(obj: T): T {
    const sorted = {} as T;
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      (sorted as Record<string, unknown>)[key] = obj[key];
    });
    return sorted;
  }
}
