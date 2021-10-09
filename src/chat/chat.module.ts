// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Chat
import { ChatGateway } from '@app/chat/chat.gateway';
import { ChatService } from '@app/chat/chat.service';
import { Message } from '@app/chat/entities/Message.entity';
import { ChatController } from '@app/chat/chat.controller';

// Socket
import { SocketModule } from '@app/socket/socket.module';

// User
import { UserModule } from '@app/user/user.module';

// Room
import { RoomModule } from '@app/room/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    SocketModule,
    UserModule,
    RoomModule,
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
