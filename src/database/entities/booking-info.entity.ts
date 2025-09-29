import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { BookingEntity } from './booking.entity';

@Entity('booking_info')
export class BookingInfo extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @OneToOne(() => BookingEntity, (booking) => booking.info)
  booking: BookingEntity;
}
