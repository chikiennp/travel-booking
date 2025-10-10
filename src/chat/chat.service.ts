import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatStatus } from 'src/common/enums/status.enum';
import { ChatRoomEntity } from 'src/database/entities/chat-room.entity';
import { ChatEntity } from 'src/database/entities/chat.entity';
import { Repository } from 'typeorm';
import { SendChatDto } from './dto/send-chat.dto';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    private userService: UsersService,
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
  ) {}

  async findOrCreateChatRoom(
    clientId: string,
    isGuest: boolean,
    hostId?: string,
  ) {
    let room = await this.chatRoomRepository.findOne({
      where: { clientId, hostId, status: ChatStatus.OPEN },
    });

    if (!room) {
      try {
        room = await this.chatRoomRepository.save({
          clientId,
          isGuest,
          hostId,
          status: ChatStatus.OPEN,
        });
      } catch {
        room = await this.chatRoomRepository.findOne({
          where: { clientId, hostId, status: ChatStatus.OPEN },
        });
      }
    }
    return room;
  }

  async sendMessage(dto: SendChatDto): Promise<ChatEntity> {
    const room = await this.findOrCreateChatRoom(
      dto.senderId,
      dto.isGuest,
      dto.hostId,
    );
    if (!room) {
      throw new NotFoundException(ErrorMessage.CHAT_ROOM_NOT_FOUND);
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

  async getChatsByHostId(hostId: string) {
    const rooms = await this.chatRoomRepository.find({
      where: { hostId, status: ChatStatus.OPEN },
      relations: ['chats'],
      order: { createdAt: 'DESC' },
    });

    return await Promise.all(
      rooms.map(async (room) => {
        const lastMessage =
          room.chats && room.chats.length
            ? room.chats[room.chats.length - 1]
            : null;

        let clientName: string;
        if (!room.isGuest && room.clientId) {
          const user = await this.userService.findById(room.clientId);
          clientName = user?.info?.firstName ?? room.clientId;
        } else {
          clientName = `Guest-${room.clientId.slice(0, 6)}`;
        }

        return {
          id: room.id,
          clientId: room.clientId,
          clientName,
          lastMessage: lastMessage?.content || null,
          lastSender: lastMessage?.senderName || null,
        };
      }),
    );
  }
}
