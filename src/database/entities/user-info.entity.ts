import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbstractEntity } from './base.entity';

@Entity('user_info')
export class UserInfo extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'json', nullable: true })
  preferences: Record<string, any>;

  @OneToOne(() => UserEntity, (user) => user.info)
  user: UserEntity;
}
