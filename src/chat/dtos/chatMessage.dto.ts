// Lib
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  photoUrl: string;
}
