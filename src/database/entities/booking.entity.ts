import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { BookingItemEntity } from './booking-item.entity';
import { BookingStatus } from './../../common/enums/status.enum';
import { BookingInfo } from './booking-info.entity';
import { PaymentEntity } from './payment.entity';

@Entity('bookings')
export class BookingEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ type: 'date' })
  checkIn: Date;

  @Column({ type: 'date' })
  checkOut: Date;

  @Column({ type: 'int' })
  guestCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @OneToMany(() => BookingItemEntity, (item) => item.booking, { cascade: true })
  items: BookingItemEntity[];

  @OneToOne(() => BookingInfo, (info) => info.booking, { cascade: true })
  @JoinColumn()
  info: BookingInfo;

  @OneToMany(() => PaymentEntity, (payment) => payment.booking)
  payments: PaymentEntity[];
}
