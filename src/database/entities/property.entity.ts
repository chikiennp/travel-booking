import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './base.entity';

@Entity('properties')
export class PropertyEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
