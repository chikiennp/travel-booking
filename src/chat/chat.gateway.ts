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
import { BadGatewayException } from '@nestjs/common';
import { ErrorMessage } from 'src/common/enums/message.enums';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: number = 0;
  private processedMessages = new Map<string, number>();
  private readonly MESSAGE_COOLDOWN_MS = 500;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    this.users++;
    this.server.emit('users', this.users);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.users--;
    this.server.emit('users', this.users);
  }

  disconnectAllClients() {
    this.server.disconnectSockets(true);
  }

  @SubscribeMessage('admin_disconnect_all')
  handleAdminDisconnectAll(@ConnectedSocket() client: Socket) {
    this.disconnectAllClients();
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.join(roomId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendChatDto,
  ): Promise<void> {
    const fingerprint = `${payload.senderId}:${payload.content}`;
    const now = Date.now();
    const lastProcessedTime = this.processedMessages.get(fingerprint) || 0;

    if (now - lastProcessedTime < this.MESSAGE_COOLDOWN_MS) {
      throw new BadGatewayException(ErrorMessage.MESSAGE_SENT_TOO_FAST);
      return;
    }
    try {
      this.processedMessages.set(fingerprint, now);
      const message = await this.chatService.sendMessage(payload);
      const roomId = message.chatRoom.id;

      await client.join(roomId);
      this.server.to(roomId).emit('receive_message', message);
    } catch (error) {
      this.processedMessages.delete(fingerprint);
      client.emit('error', `Failed to send: ${error.message}`);
    }
  }
}
