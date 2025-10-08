import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ChatRoomEntity } from './chat-room.entity';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  senderId: string;

  @Column({ nullable: true })
  senderName?: string;

  @Column({ default: false })
  isGuest: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => ChatRoomEntity, (chatRoom) => chatRoom.chats, {
    nullable: false,
  })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoomEntity;
}
