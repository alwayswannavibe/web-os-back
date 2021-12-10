// Libraries
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateToDoDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  heading?: string;

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
