// Libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Common
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';
import { CustomError } from '@app/common/enums/customError.enum';

// Room
import { Room } from '@app/room/entities/Room.entity';
import { GetRoomsByUserResponseDto } from '@app/room/dtos/getRoomsByUserResponse.dto';
import { CreateRoomRequestDto } from '@app/room/dtos/createRoomRequest.dto';
import { AddUserToRoomRequestDto } from '@app/room/dtos/addUserToRoomRequest.dto';

// User
import { User } from '@app/user/entities/user.entity';

// Chat
import { Message } from '@app/chat/entities/Message.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly chatRepository: Repository<Message>,
  ) {}

  async getRoomsByUser(
    user: UserIdAndUsername,
  ): Promise<GetRoomsByUserResponseDto[]> {
    const userInDB = await this.userRepository.findOne(user.id, {
      select: ['roomsIds'],
    });

    const rooms: GetRoomsByUserResponseDto[] = [];

    for (const id of userInDB.roomsIds) {
      const room = await this.roomRepository.findOne(id);
      const roomWithAdditionFields: GetRoomsByUserResponseDto = {
        ...room,
        lastMessage: null,
        numberOfNewMessages: 0,
      };

      const messages = await this.chatRepository
        .createQueryBuilder('messages')
        .leftJoinAndSelect('messages.owner', 'owner')
        .select([
          'messages.text',
          'messages.createdAt',
          'messages.updatedAt',
          'messages.id',
          'messages.listOfReaders',
          'owner.username',
        ])
        .where('messages.toRoomId = :to', { to: id })
        .getMany();

      roomWithAdditionFields.numberOfNewMessages = messages.filter(
        (message) =>
          !message.listOfReaders.includes(user.id) &&
          message.owner.id !== user.id,
      ).length;
      roomWithAdditionFields.lastMessage =
        messages[messages.length - 1] || null;

      rooms.push(roomWithAdditionFields);
    }

    return rooms;
  }

  async createRoom(
    user: UserIdAndUsername,
    createRoomRequestDto: CreateRoomRequestDto,
  ): Promise<CoreResponse> {
    const roomInDB = await this.roomRepository.findOne({
      name: createRoomRequestDto.name,
    });

    if (roomInDB) {
      return {
        isSuccess: false,
        error: CustomError.AlreadyExist,
      };
    }

    for (const id of createRoomRequestDto.usersIds) {
      const userInDB = await this.userRepository.findOne(id);

      if (!userInDB) {
        return {
          isSuccess: false,
          error: CustomError.UserNotExist,
        };
      }
    }

    const userList = [...(createRoomRequestDto.usersIds || []), user.id];

    const newRoom = await this.roomRepository.create({
      usersIds: userList,
      ownerId: user.id,
      name: createRoomRequestDto.name,
      image: createRoomRequestDto.image,
    });

    const newRoomInDB = await this.roomRepository.save(newRoom);

    for (const id of userList) {
      const user = await this.userRepository.findOne(id);
      user.roomsIds.push(newRoomInDB.id);
      this.userRepository.save(user);
    }

    return {
      isSuccess: true,
    };
  }

  async addUserToRoom(
    user: UserIdAndUsername,
    addUserToRoomDto: AddUserToRoomRequestDto,
  ): Promise<CoreResponse> {
    const room = await this.roomRepository.findOne(addUserToRoomDto.roomId, {
      relations: ['users'],
    });

    if (!room) {
      return {
        isSuccess: false,
        error: CustomError.RoomNotExist,
      };
    }

    if (room.ownerId !== user.id) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    const userToAddInDB = await this.userRepository.findOne(
      addUserToRoomDto.userToAddId,
    );

    if (!userToAddInDB) {
      return {
        isSuccess: false,
        error: CustomError.UserNotExist,
      };
    }

    room.usersIds.push(userToAddInDB.id);
    userToAddInDB.roomsIds.push(room.id);

    this.userRepository.save(room);
    this.roomRepository.save(userToAddInDB);

    return {
      isSuccess: true,
    };
  }

  async deleteUserFromRoom(userId: number, payload): Promise<CoreResponse> {
    const room = await this.roomRepository.findOne(payload.roomId, {
      relations: ['users'],
    });

    if (!room) {
      return {
        isSuccess: false,
        error: CustomError.RoomNotExist,
      };
    }

    if (room.ownerId !== userId) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    const user = await this.userRepository.findOne(payload.userToDeleteId);

    if (!user) {
      return {
        isSuccess: false,
        error: CustomError.UserNotExist,
      };
    }

    const deleteUserIndex = room.usersIds.indexOf(user.id);
    const deleteRoomIndex = user.roomsIds.indexOf(room.id);

    if (deleteUserIndex === -1 || deleteRoomIndex === -1) {
      return {
        isSuccess: false,
        error: CustomError.UserNotExist,
      };
    }

    room.usersIds.splice(deleteUserIndex, 1);
    user.roomsIds.splice(deleteRoomIndex, 1);

    this.userRepository.save(room);
    this.roomRepository.save(user);

    return {
      isSuccess: true,
    };
  }

  async getUsersIdsByRoomId(roomId: number): Promise<number[]> {
    const room = await this.roomRepository.findOne(roomId, {
      select: ['usersIds'],
    });
    return room.usersIds;
  }
}
