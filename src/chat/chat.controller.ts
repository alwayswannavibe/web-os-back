// Lib
import { Controller, Get, Req } from '@nestjs/common';

// Chat
import { ChatService } from '@app/chat/chat.service';
import { Message } from '@app/chat/entities/Message.entity';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages(@Req() req): Promise<Message[]> {
    console.log(req.user);
    return this.chatService.getMessages();
  }
}
