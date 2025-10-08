// chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from 'src/database/entities/chat-room.entity';
import { ChatEntity } from 'src/database/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomEntity, ChatEntity])],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway, ChatService],
})
export class ChatModule {}
