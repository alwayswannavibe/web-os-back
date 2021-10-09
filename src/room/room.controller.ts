// Libraries
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// Common
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';
import { User } from '@app/common/decorators/user.decorator';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';

// Room
import { RoomService } from '@app/room/room.service';
import { GetRoomsByUserResponseDto } from '@app/room/dtos/getRoomsByUserResponse.dto';
import { CreateRoomRequestDto } from '@app/room/dtos/createRoomRequest.dto';
import { AddUserToRoomRequestDto } from '@app/room/dtos/addUserToRoomRequest.dto';

@Controller('room')
@ApiTags('Room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('rooms')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all rooms' })
  getRooms(
    @User() user: UserIdAndUsername,
  ): Promise<GetRoomsByUserResponseDto[]> {
    return this.roomService.getRoomsByUser(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  @Post('rooms')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new room' })
  createRoom(
    @User() user: UserIdAndUsername,
    @Body() createRoomRequestDto: CreateRoomRequestDto,
  ): Promise<CoreResponse> {
    return this.roomService.createRoom(user, createRoomRequestDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('room/users')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Add user to room' })
  addUserToRoom(
    @User() user: UserIdAndUsername,
    @Body() addUserToRoomDto: AddUserToRoomRequestDto,
  ): Promise<CoreResponse> {
    return this.roomService.addUserToRoom(user, addUserToRoomDto);
  }
}
