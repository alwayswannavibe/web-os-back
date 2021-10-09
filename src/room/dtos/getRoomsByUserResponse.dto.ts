// Chat
import { Message } from '@app/chat/entities/Message.entity';

// Room
import { Room } from '@app/room/entities/Room.entity';

export class GetRoomsByUserResponseDto extends Room {
  lastMessage: Message | null;

  numberOfNewMessages: number;
}
