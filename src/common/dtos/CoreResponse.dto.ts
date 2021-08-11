// Lib
import { IsNotEmpty } from 'class-validator';

export class CoreResponse {
  error?: string;

  @IsNotEmpty()
  isSuccess: boolean;
}
