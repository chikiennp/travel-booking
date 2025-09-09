import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { BookingEntity } from './booking.entity';
import { RoomEntity } from './room.entity';

@Entity('booking_items')
export class BookingItemEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BookingEntity, (booking) => booking.items, {
    onDelete: 'CASCADE',
  })
  booking: BookingEntity;

  @ManyToOne(() => RoomEntity, { onDelete: 'CASCADE' })
  room: RoomEntity;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  pricePerNight: number;

  @Column({ type: 'int' })
  nights: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subTotal: number;
}
