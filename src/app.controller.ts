import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Post('auth/register')
  async register(@Request() req): Promise<CoreResponse> {
    return this.authService.register(req.body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
