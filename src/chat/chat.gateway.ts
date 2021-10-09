// Libraries
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';

// Common
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';
import { User } from '@app/common/decorators/user.decorator';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';

// Chat
import { ChatService } from '@app/chat/chat.service';
import { HandleMessageDto } from '@app/chat/dtos/handleMessage.dto';
import { ReadMessageDto } from '@app/chat/dtos/readMessage.dto';

// Socket
import { SocketService } from '@app/socket/socket.service';

// Room
import { RoomService } from '@app/room/room.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly socketService: SocketService,
    private readonly roomService: RoomService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    this.socketService.removeSocket(client);
  }

  handleConnection(client: Socket) {
    this.socketService.addSocket(client);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  @SubscribeMessage('chatMsg')
  async handleMessage(
    @User() user: UserIdAndUsername,
    @MessageBody() handleMessageDto: HandleMessageDto,
  ): Promise<CoreResponse> {
    return this.chatService.handleMessage(handleMessageDto, user, this.server);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  @SubscribeMessage('readMessages')
  async readMessages(
    @User() user: UserIdAndUsername,
    @MessageBody() readMessageDto: ReadMessageDto,
  ): Promise<CoreResponse> {
    return this.chatService.readMessages(readMessageDto, user, this.server);
  }
}
