// Lib
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

// Chat
import { ChatMessageDto } from '@app/chat/dtos/chatMessage.dto';
import { ChatService } from '@app/chat/chat.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('chatMsg')
  async handleMessage(client: Socket, payload: ChatMessageDto): Promise<void> {
    const result = await this.chatService.handleMessage(payload);
    if (result.error) {
      return;
    }

    this.server.emit('chatUpdate');
  }
}
