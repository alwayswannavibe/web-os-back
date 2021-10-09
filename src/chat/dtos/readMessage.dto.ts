// Libraries
import { IsEnum, IsNumber } from 'class-validator';

// Chat
import { MessageToType } from '@app/chat/enums/messageToType.enum';

export class ReadMessageDto {
  @IsNumber()
  id: number;

  @IsEnum(MessageToType)
  activeType: MessageToType;
}
