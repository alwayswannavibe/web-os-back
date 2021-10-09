// Libraries
import { IsNumber } from 'class-validator';

export class AddUserToRoomRequestDto {
  @IsNumber()
  roomId: number;

  @IsNumber()
  userToAddId: number;
}
