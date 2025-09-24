import { RoleEntity } from './user-role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './base.entity';
import { ActiveStatus } from '../../common/enums/status.enum';
import { UserInfo } from './user-info.entity';
import { PropertyEntity } from './property.entity';
import { ReviewEntity } from './review.entity';
import { BookingEntity } from './booking.entity';
import { BookingDraftEntity } from './draft.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ActiveStatus,
    default: ActiveStatus.ACTIVE,
  })
  status: ActiveStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'roleId' },
  })
  roles: RoleEntity[];

  @OneToOne(() => UserInfo, (info) => info.user, { cascade: true })
  @JoinColumn()
  info: UserInfo;

  @OneToMany(() => PropertyEntity, (property) => property.host)
  properties: PropertyEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings: BookingEntity[];

  @OneToMany(() => BookingDraftEntity, (draft) => draft.user)
  bookingDrafts: BookingDraftEntity[];
}
