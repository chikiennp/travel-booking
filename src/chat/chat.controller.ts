import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/common/decorators/user.decorator';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Auth(Role.HOST)
  @Get()
  async getChatsByHostId(@User('sub') hostId: string) {
    return this.chatService.getChatsByHostId(hostId);
  }

  @Auth(Role.HOST)
  @Get('room/:roomId')
  async getMessagesByRoom(@Param('roomId') roomId: string) {
    return await this.chatService.getMessagesByRoomId(roomId);
  }

  @Auth(Role.CUSTOMER)
  @Get('host/:hostId')
  async getMessagesByHost(
    @Param('hostId') hostId: string,
    @User('sub') userId: string,
  ) {
    return await this.chatService.getMessagesByHostId(userId, hostId);
  }
}
