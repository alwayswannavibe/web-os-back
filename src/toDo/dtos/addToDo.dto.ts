// Libraries
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AddToDoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  heading: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
