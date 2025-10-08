/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SendChatDto } from './dto/send-chat.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: number = 0;
  private activeClients = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    this.users++;
    this.server.emit('users', this.users);
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.users--;
    const roomId = this.activeClients.get(client.id);
    if (roomId) {
      await client.leave(roomId);
      this.activeClients.delete(client.id);
    }
    this.server.emit('users', this.users);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendChatDto,
  ): Promise<void> {
    try {
      const message = await this.chatService.sendMessage(payload);
      const roomId = message.chatRoom.id;
      this.server.to(roomId).emit('receive_message', message);

      await client.join(roomId);
      this.activeClients.set(client.id, roomId);
    } catch (error) {
      client.emit('error', `Failed to send: ${error.message}`);
    }
  }
}
