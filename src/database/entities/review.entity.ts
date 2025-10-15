import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { PropertyEntity } from './property.entity';

@Entity('reviews')
export class ReviewEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PropertyEntity, (property) => property.reviews, {
    onDelete: 'CASCADE',
  })
  property: PropertyEntity;
}
