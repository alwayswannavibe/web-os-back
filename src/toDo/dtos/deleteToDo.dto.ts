// Libraries
import { IsInt } from 'class-validator';

export class DeleteToDoDto {
  @IsInt()
  id: number;
}
