import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegistrationDto } from '@app/auth/dtos/registration.dto';
import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';
import { CustomError } from '@app/common/enums/customError.enum';
import { LoginDto } from '@app/auth/dtos/login.dto';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';
import { AccessTokenDto } from '@app/auth/dtos/accessToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto): Promise<CoreResponse | AccessTokenDto> {
    const userInDB = await this.userRepository.findOne({
      username: loginDto.username,
    });

    if (
      !userInDB ||
      !(await bcrypt.compare(loginDto.password, userInDB.password))
    ) {
      return {
        isSuccess: false,
        error: CustomError.WrongLoginOrPassword,
      };
    }

    const payload = { username: userInDB.username, id: userInDB.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async register(registrationDto: RegistrationDto) {
    const user = await this.userRepository.findOne({
      username: registrationDto.username,
    });

    if (user) {
      return {
        isSuccess: false,
        error: CustomError.AlreadyExist,
      };
    }

    if (!/^[A-z0-9_-]+$/.test(registrationDto.username)) {
      return {
        isSuccess: false,
        error: CustomError.UsernameIncompatibleWithPattern,
      };
    }

    const newUserIntance = await this.userRepository.create(registrationDto);

    const userInDB = await this.userRepository.save(newUserIntance);

    const payload = { username: userInDB.username, id: userInDB.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserFromSocket(client: Socket): Promise<User> {
    try {
      const token = client.handshake.headers.cookie.split('=')[1];
      const payload = this.jwtService.verify(token);
      const user = await this.userService.getUserById(payload.id);
      return user;
    } catch (error) {
      return null;
    }
  }

  async logout() {
    return this.jwtService.sign({}, { expiresIn: 1 });
  }
}
