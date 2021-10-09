// Lib
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';

// Chat
import { Message } from '@app/chat/entities/Message.entity';
import { HandleMessageDto } from '@app/chat/dtos/handleMessage.dto';
import { MessageToType } from '@app/chat/enums/messageToType.enum';

// Common
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';
import { CustomError } from '@app/common/enums/customError.enum';

// User
import { UserService } from '@app/user/user.service';

// Chat
import { MessageInResponse } from '@app/chat/interfaces/messageInResponse.interface';
import { ReadMessageDto } from '@app/chat/dtos/readMessage.dto';

// Room
import { RoomService } from '@app/room/room.service';

// Socket
import { SocketService } from '@app/socket/socket.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly chatRepository: Repository<Message>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly socketService: SocketService,
  ) {}

  async handleMessage(
    handleMessageDto: HandleMessageDto,
    user: UserIdAndUsername,
    wsServer: Server,
  ): Promise<CoreResponse> {
    if (handleMessageDto.text.trim().length === 0) {
      return {
        isSuccess: false,
        error: CustomError.WrongRequestBody,
      };
    }

    if (
      handleMessageDto.toRoomId === undefined &&
      handleMessageDto.toUserId === undefined
    ) {
      return {
        isSuccess: false,
        error: CustomError.WrongRequestBody,
      };
    }

    if (
      handleMessageDto.toRoomId !== undefined &&
      handleMessageDto.toUserId !== undefined
    ) {
      return {
        isSuccess: false,
        error: CustomError.WrongRequestBody,
      };
    }

    const userInDB = await this.userService.getUserById(user.id);

    const newMsg = await this.chatRepository.save({
      ...handleMessageDto,
      owner: userInDB,
    });

    const message: MessageInResponse = {
      id: newMsg.id,
      createdAt: newMsg.createdAt,
      owner: {
        username: newMsg.owner.username,
        id: newMsg.owner.id,
      },
      text: newMsg.text,
      toUserId: newMsg.toUserId,
      toRoomId: newMsg.toRoomId,
      listOfReaders: [],
    };

    if (handleMessageDto.toRoomId !== undefined) {
      const users = await this.roomService.getUsersIdsByRoomId(
        handleMessageDto.toRoomId,
      );

      if (!users) return;

      for (const userId of users) {
        const socket = await this.socketService.getSocketIdFromUserId(userId);

        if (socket) {
          wsServer.to(socket).emit('chatUpdate', message);
        }
      }
    }

    if (handleMessageDto.toUserId !== undefined) {
      const toSocket = await this.socketService.getSocketIdFromUserId(
        message.toUserId,
      );

      if (toSocket) {
        wsServer.to(toSocket).emit('chatUpdate', message);
      }

      const fromSocket = await this.socketService.getSocketIdFromUserId(
        message.owner.id,
      );

      if (fromSocket) {
        wsServer.to(fromSocket).emit('chatUpdate', message);
      }
    }

    return {
      isSuccess: true,
    };
  }

  async getMessages(from: number, type: string, user: any): Promise<Message[]> {
    if (type === MessageToType.Room) {
      return this.chatRepository
        .createQueryBuilder('messages')
        .leftJoinAndSelect('messages.owner', 'owner')
        .select([
          'owner.username',
          'owner.id',
          'messages.text',
          'messages.createdAt',
          'messages.id',
          'messages.listOfReaders',
        ])
        .where('messages.toRoomId = :toIdRoom', { toIdRoom: from })
        .orderBy('messages.createdAt')
        .getMany();
    }

    return this.chatRepository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.owner', 'owner')
      .select([
        'owner.username',
        'owner.id',
        'messages.text',
        'messages.createdAt',
        'messages.id',
        'messages.listOfReaders',
      ])
      .where(
        new Brackets((qb) => {
          qb.where('owner.id in (:...from)', {
            from: [from, user.id],
          }).andWhere('messages.toUserId in (:...toUserId)', {
            toUserId: [user.id, from],
          });
        }),
      )
      .orderBy('messages.createdAt')
      .getMany();
  }

  async readMessages(
    readMessageDto: ReadMessageDto,
    user: UserIdAndUsername,
    wsServer: Server,
  ): Promise<CoreResponse> {
    if (readMessageDto.activeType === MessageToType.User) {
      const messages = await this.chatRepository
        .createQueryBuilder('messages')
        .leftJoinAndSelect('messages.owner', 'owner')
        .select(['messages.id'])
        .where(
          new Brackets((qb) => {
            qb.where('owner.id = :from', { from: readMessageDto.id }).andWhere(
              'messages.toUserId = :to',
              { to: user.id },
            );
          }),
        )
        .getMany();

      for (const index in messages) {
        const message = await this.chatRepository.findOne(messages[index].id, {
          relations: ['owner'],
        });

        if (
          !message.listOfReaders.includes(user.id) &&
          message.owner.id !== user.id
        ) {
          message.listOfReaders.push(user.id);

          await this.chatRepository.save(message);
        }
      }
    }

    if (readMessageDto.activeType === MessageToType.Room) {
      const messages = await this.chatRepository
        .createQueryBuilder('messages')
        .select(['messages.id'])
        .where('messages.toRoomId = :from', { from: readMessageDto.id })
        .getMany();

      for (const messageId of messages) {
        const message = await this.chatRepository.findOne(messageId.id, {
          relations: ['owner'],
        });

        if (
          !message.listOfReaders.includes(user.id) &&
          message.owner.id !== user.id
        ) {
          message.listOfReaders.push(user.id);

          await this.chatRepository.save(message);
        }
      }
    }

    if (readMessageDto.activeType === MessageToType.Room) {
      const users = await this.roomService.getUsersIdsByRoomId(
        readMessageDto.id,
      );

      console.log(users);

      if (!users) {
        return {
          isSuccess: true,
        };
      }

      for (const userId of users) {
        const socket = await this.socketService.getSocketIdFromUserId(userId);

        if (socket) {
          wsServer.to(socket).emit('readMessages', {
            id: user.id,
            roomId: readMessageDto.id,
            activeType: readMessageDto.activeType,
          });
        }
      }

      return {
        isSuccess: true,
      };
    }

    if (readMessageDto.activeType === MessageToType.User) {
      const toSocket = await this.socketService.getSocketIdFromUserId(
        readMessageDto.id,
      );

      if (toSocket) {
        wsServer.to(toSocket).emit('readMessages', {
          id: user.id,
          activeType: readMessageDto.activeType,
        });
      }
    }
  }
}
