import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { DraftItemEntity } from './draft-item.entity';

@Entity('booking_drafts')
export class BookingDraftEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.bookingDrafts, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ type: 'date', nullable: true })
  checkIn: Date;

  @Column({ type: 'date', nullable: true })
  checkOut: Date;

  @Column({ type: 'int', nullable: true })
  guestCount: number;

  @OneToMany(() => DraftItemEntity, (item) => item.draft, {
    cascade: true,
  })
  items: DraftItemEntity[];
}
