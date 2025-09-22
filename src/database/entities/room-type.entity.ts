import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PropertyEntity } from './property.entity';
import { RoomEntity } from './room.entity';
import { AbstractEntity } from './base.entity';

@Entity('room_types')
export class RoomType extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PropertyEntity, (property) => property.roomTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: PropertyEntity;

  @Column()
  name: string;

  @Column({ type: 'json', nullable: true })
  beds?: { type: string; quantity: number }[];

  @Column()
  capacity: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @OneToMany(() => RoomEntity, (room) => room.roomType)
  rooms: RoomEntity[];
}
