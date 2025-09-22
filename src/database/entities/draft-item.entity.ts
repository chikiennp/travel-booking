import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { RoomEntity } from './room.entity';
import { BookingDraftEntity } from './draft.entity';

@Entity('booking_draft_items')
export class DraftItemEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BookingDraftEntity, (draft) => draft.items, {
    onDelete: 'CASCADE',
  })
  draft: BookingDraftEntity;

  @ManyToOne(() => RoomEntity, { onDelete: 'CASCADE' })
  room: RoomEntity;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  pricePerNight: number;
}
