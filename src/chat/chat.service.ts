import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { ChatStatus } from 'src/common/enums/status.enum';
import { ChatRoomEntity } from 'src/database/entities/chat-room.entity';
import { ChatEntity } from 'src/database/entities/chat.entity';
import { Repository } from 'typeorm';
import { SendChatDto } from './dto/send-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
  ) {}

  async findOne(roomId: string): Promise<ChatRoomEntity> {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['chats'],
    });

    if (!room) throw new NotFoundException(ErrorMessage.CHAT_ROOM_NOT_FOUND);
    return room;
  }

  async findOrCreateChatRoom(
    clientId: string,
    isGuest: boolean,
    hostId?: string,
  ): Promise<ChatRoomEntity> {
    let room = await this.chatRoomRepository.findOne({
      where: {
        clientId,
        isGuest,
        status: ChatStatus.OPEN,
        hostId,
      },
    });

    if (!room) {
      room = await this.chatRoomRepository.save({
        clientId,
        isGuest,
        status: ChatStatus.OPEN,
        hostId,
      });
    }

    return room;
  }

  async sendMessage(dto: SendChatDto): Promise<ChatEntity> {
    let room: ChatRoomEntity;
    if (!dto.chatRoomId) {
      room = await this.findOrCreateChatRoom(
        dto.senderId,
        dto.isGuest,
        dto.hostId,
      );
    } else {
      room = await this.findOne(dto.chatRoomId);
    }

    const message = {
      content: dto.content,
      senderId: dto.senderId,
      senderName: dto.senderName,
      isGuest: dto.isGuest,
      chatRoom: room,
    };

    return this.chatRepository.save(message);
  }
}
