// Libraries
import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoomRequestDto {
  @IsString()
  image: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsArray()
  @Type(() => Number)
  usersIds: number[];
}
