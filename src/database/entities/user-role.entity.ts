import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  role: string;

  @Column({ nullable: true })
  description: string;
}
