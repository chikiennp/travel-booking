import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ReviewEntity } from './review.entity';
import { ActiveStatus } from '../../common/enums/status.enum';
import { RoomType } from './room-type.entity';

@Entity('properties')
export class PropertyEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ActiveStatus,
    default: ActiveStatus.ACTIVE,
  })
  status: ActiveStatus;

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => UserEntity, (user) => user.properties, {
    onDelete: 'CASCADE',
  })
  host: UserEntity;

  @OneToMany(() => RoomType, (roomType) => roomType.property, { cascade: true })
  roomTypes: RoomType[];

  @OneToMany(() => ReviewEntity, (review) => review.property)
  reviews: ReviewEntity[];
}
