import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { PropertyEntity } from './property.entity';
import { RoomStatus } from '../../common/enums/status.enum';

@Entity('rooms')
export class RoomEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'text', nullable: true })
  features: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => PropertyEntity, (property) => property.rooms, {
    onDelete: 'CASCADE',
  })
  property: PropertyEntity;
}
