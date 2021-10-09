// Libraries
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

// Common
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';

// User
import { User } from '@app/user/entities/user.entity';

// Chat
import { Message } from '@app/chat/entities/Message.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly chatRepository: Repository<Message>,
  ) {}

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async getUsers(user: UserIdAndUsername): Promise<any> {
    const users: any = await this.userRepository.find({
      select: ['id', 'username', 'online', 'lastVisit'],
    });

    users.splice(
      users.findIndex((el) => user.id === el.id),
      1,
    );

    for (const userIndex in users) {
      const from = users[userIndex].id;
      const messages = await this.chatRepository
        .createQueryBuilder('messages')
        .leftJoinAndSelect('messages.owner', 'owner')
        .select([
          'messages.text',
          'messages.createdAt',
          'messages.id',
          'messages.listOfReaders',
        ])
        .where('messages.toUserId = :to', { to: user.id })
        .andWhere('owner.id = :from', { from })
        .getMany();
      users[userIndex].numberOfNewMessages = messages.filter(
        (message) => !message.listOfReaders.includes(user.id),
      ).length;
      users[userIndex].lastMessage = messages[messages.length - 1] || null;
    }

    return users;
  }
}
