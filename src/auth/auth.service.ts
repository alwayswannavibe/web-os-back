import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';
import { RegistrationDto } from '@app/auth/dtos/registration.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(user: RegistrationDto) {
    const userInDB = await this.userRepository.findOne({
      username: user.username,
    });

    if (
      !userInDB ||
      !(await bcrypt.compare(user.password, userInDB.password))
    ) {
      return {
        isSuccess: false,
        error: "User doesn't exist or password is wrong",
      };
    }

    const payload = { username: userInDB.username, id: userInDB.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(newUser: RegistrationDto): Promise<CoreResponse> {
    const user = await this.userRepository.findOne({
      username: newUser.username,
    });

    if (user) {
      return {
        isSuccess: false,
        error: 'User with this username already exist',
      };
    }

    if (!/^[A-z0-9_-]+$/.test(newUser.username)) {
      return {
        isSuccess: false,
        error:
          'Username must contain only letters, numbers, dash and underscore',
      };
    }

    if (newUser.username.length < 5) {
      return {
        isSuccess: false,
        error: 'Username must be at least 5 characters',
      };
    }

    if (newUser.username.length > 20) {
      return {
        isSuccess: false,
        error: 'Username must be no more then 20 characters',
      };
    }

    if (newUser.password.length < 5) {
      return {
        isSuccess: false,
        error: 'Password must be at least 5 characters',
      };
    }

    if (newUser.password.length > 20) {
      return {
        isSuccess: false,
        error: 'Password must be no more then 20 characters',
      };
    }

    const newUserIntance = this.userRepository.create(newUser);

    this.userRepository.save(newUserIntance);

    return {
      isSuccess: true,
    };
  }
}
