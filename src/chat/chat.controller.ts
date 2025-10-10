import { Controller, Get } from '@nestjs/common';
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
}
