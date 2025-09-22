import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0, // TIMESTAMP(0)
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
