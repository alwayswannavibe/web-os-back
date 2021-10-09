// Libraries
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HandleMessageDto {
  @IsString()
  text: string;

  @IsNumber()
  @IsOptional()
  toUserId?: number;

  @IsNumber()
  @IsOptional()
  toRoomId?: number;
}
