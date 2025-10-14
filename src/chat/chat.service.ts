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

  async sendMessage(dto: SendChatDto): Promise<ChatEntity> {
    let room: ChatRoomEntity | null = null;

    if (dto.chatRoomId) {
      room = await this.chatRoomRepository.findOne({
        where: { id: dto.chatRoomId, status: ChatStatus.OPEN },
      });
      if (!room) {
        throw new NotFoundException(ErrorMessage.CHAT_ROOM_NOT_FOUND);
      }
    } else {
      room = await this.chatRoomRepository.findOne({
        where: [
          { hostId: dto.senderId, clientId: dto.receiverId },
          { hostId: dto.receiverId, clientId: dto.senderId },
        ],
      });
    }

    if (!room) {
      room = this.chatRoomRepository.create({
        hostId: dto.hostId,
        clientId: dto.userId,
        status: ChatStatus.OPEN,
      });
      await this.chatRoomRepository.save(room);
    }

    const message = this.chatRepository.create({
      content: dto.content,
      senderId: dto.senderId,
      senderName: dto.senderName,
      chatRoom: room,
    });

    return this.chatRepository.save(message);
  }

  async getChatsByHostId(hostId: string) {
    const rooms = await this.chatRoomRepository.find({
      where: { hostId, status: ChatStatus.OPEN },
      relations: ['chats'],
      order: { createdAt: 'DESC' },
    });
    if (!rooms) {
      throw new NotFoundException(ErrorMessage.CHAT_ROOM_NOT_FOUND);
    }

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

  async getMessagesByRoomId(roomId: string) {
    const messages = await this.chatRepository.find({
      where: { chatRoom: { id: roomId } },
      order: { createdAt: 'ASC' },
    });
    if (!messages.length) {
      throw new NotFoundException(ErrorMessage.CHAT_ROOM_NOT_FOUND);
    }

    return messages.map((chat) => ({
      id: chat.id,
      content: chat.content,
      senderId: chat.senderId,
      senderName: chat.senderName,
      isGuest: chat.isGuest,
      createdAt: chat.createdAt,
    }));
  }

  async getMessagesByHostId(userId: string, hostId: string) {
    const room = await this.chatRoomRepository.findOne({
      where: { clientId: userId, hostId: hostId, status: ChatStatus.OPEN },
    });
    if (!room) {
      throw new NotFoundException(ErrorMessage.CHAT_ROOM_NOT_FOUND);
    }

    const messages = await this.chatRepository.find({
      where: { chatRoom: room },
      order: { createdAt: 'ASC' },
    });

    return messages.map((chat) => ({
      id: chat.id,
      content: chat.content,
      senderId: chat.senderId,
      senderName: chat.senderName,
      createdAt: chat.createdAt,
    }));
  }
}
