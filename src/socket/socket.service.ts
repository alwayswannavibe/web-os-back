// Libraries
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// User
import { User } from '@app/user/entities/user.entity';

// Socket
import { SocketEntity } from '@app/socket/entities/socket.entity';

// Auth
import { AuthService } from '@app/auth/auth.service';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SocketEntity)
    private readonly socketRepository: Repository<SocketEntity>,
    private authService: AuthService,
  ) {}

  async addSocket(client: Socket): Promise<void> {
    const user = await this.authService.getUserFromSocket(client);

    if (!user) return;

    const socketInDB = await this.socketRepository.findOne({
      userId: user.id,
    });

    if (socketInDB) {
      await this.socketRepository.remove(socketInDB);
    }

    const newSocket = this.socketRepository.create({
      userId: user.id,
      socketId: client.id,
    });
    this.userRepository.update(user.id, { online: true });
    this.socketRepository.save(newSocket);
  }

  async removeSocket(client: Socket): Promise<void> {
    const user = await this.authService.getUserFromSocket(client);

    if (!user) return;

    const socket = await this.socketRepository.findOne({
      socketId: client.id,
    });
    this.userRepository.update(user.id, {
      online: false,
      lastVisit: new Date(),
    });
    this.socketRepository.remove(socket);
  }

  async getSocketIdFromUserId(userId: number): Promise<string | undefined> {
    const socket = await this.socketRepository.findOne({ userId: userId });
    return socket?.socketId;
  }
}
