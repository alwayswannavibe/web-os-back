// Lib
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Chat
import { Message } from '@app/chat/entities/Message.entity';
import { ChatMessageDto } from '@app/chat/dtos/chatMessage.dto';

// Common
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly chatRepository: Repository<Message>,
  ) {}

  async handleMessage(chatMessageDto: ChatMessageDto): Promise<CoreResponse> {
    if (!chatMessageDto.text.trim()) {
      return {
        isSuccess: false,
        error: 'text is empty',
      };
    }

    await this.chatRepository.save(chatMessageDto);

    return {
      isSuccess: true,
    };
  }

  async getMessages(): Promise<Message[]> {
    return this.chatRepository.find();
  }
}
