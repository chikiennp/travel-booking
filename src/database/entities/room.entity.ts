import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './base.entity';
import { RoomStatus } from '../../common/enums/status.enum';
import { RoomType } from './room-type.entity';

@Entity('rooms')
export class RoomEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomTypeId' })
  roomType: RoomType;

  @Column()
  roomNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'json', nullable: true })
  beds?: { type: string; quantity: number };

  @Column({ type: 'text', nullable: true })
  features: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @Column('simple-array', { nullable: true })
  images: string[];
}
