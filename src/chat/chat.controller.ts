// Libraries
import {
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

// Common
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';

// User
import { User } from '@app/common/decorators/user.decorator';

// Chat
import { ChatService } from '@app/chat/chat.service';
import { Message } from '@app/chat/entities/Message.entity';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('messages')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all message that you can see' })
  getMessages(
    @User() user: UserIdAndUsername,
    @Query('from', ParseIntPipe) from: number,
    @Query('type') type: string,
  ): Promise<Message[]> {
    return this.chatService.getMessages(from, type, user);
  }
}
