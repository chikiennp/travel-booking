// src/database/entities/seasonal-pricing.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './base.entity';

@Entity('seasonal_prices')
export class SeasonalPricingEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'price_multiplier' })
  priceMultiplier: number;
}
