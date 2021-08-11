// Lib
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Chat
import { ChatGateway } from '@app/chat/chat.gateway';
import { ChatService } from '@app/chat/chat.service';
import { Message } from '@app/chat/entities/Message.entity';
import { ChatController } from '@app/chat/chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
