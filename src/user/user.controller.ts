// Libraries
import {
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Common
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';
import { User } from '@app/common/decorators/user.decorator';

// User
import { UserService } from '@app/user/user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user info from token' })
  getProfile(@User() user: UserIdAndUsername) {
    return user.username;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all users without current user' })
  getUsers(@User() user: UserIdAndUsername) {
    return this.userService.getUsers(user);
  }
}
