import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { ChatStatus } from './../../common/enums/status.enum';

@Unique(['clientId', 'hostId', 'status'])
@Entity('chat_rooms')
export class ChatRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  hostId: string;

  @Column()
  clientId: string;

  @Column({ default: false })
  isGuest: boolean;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.OPEN,
  })
  status: ChatStatus;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => ChatEntity, (chat) => chat.chatRoom)
  chats: ChatEntity[];
}
