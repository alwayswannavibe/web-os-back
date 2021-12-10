// Libraries
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';
import { CustomError } from '@app/common/enums/customError.enum';

// User
import { User } from '@app/user/entities/user.entity';

// ToDoLocal
import { ToDo } from '@app/toDo/entities/ToDo.entity';
import { DeleteToDoDto } from '@app/toDo/dtos/deleteToDo.dto';
import { AddToDoDto } from '@app/toDo/dtos/addToDo.dto';
import { UpdateToDoDto } from '@app/toDo/dtos/updateToDo.dto';

@Injectable()
export class ToDoService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ToDo)
    private readonly toDoRepository: Repository<ToDo>,
  ) {}

  async getToDoItems(user: UserIdAndUsername): Promise<ToDo[]> {
    const userInDB = await this.usersRepository.findOne(user.id, {
      relations: ['toDoItems'],
    });
    return userInDB.toDoItems;
  }

  async addToDo(
    user: UserIdAndUsername,
    payload: AddToDoDto,
  ): Promise<CoreResponse> {
    const userInDB = await this.usersRepository.findOne(user.id, {
      relations: ['toDoItems'],
    });

    const newToDo = await this.toDoRepository.create({
      heading: payload.heading,
      description: payload.description || '',
      isComplete: payload.isComplete || false,
      tags: payload.tags || [],
      owner: userInDB,
    });

    userInDB.toDoItems.push(newToDo);

    await Promise.all([
      this.toDoRepository.save(newToDo),
      this.usersRepository.save(userInDB),
    ]);

    return {
      isSuccess: true,
    };
  }

  async updateToDo(
    user: UserIdAndUsername,
    payload: UpdateToDoDto,
  ): Promise<CoreResponse> {
    const toDoInDB = await this.toDoRepository.findOne(payload.id, {
      relations: ['owner'],
    });

    if (!toDoInDB) {
      return {
        isSuccess: false,
        error: CustomError.ToDoNotExist,
      };
    }

    if (toDoInDB.owner.id !== user.id) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    await this.toDoRepository.save({ ...toDoInDB, ...payload });

    return {
      isSuccess: true,
    };
  }

  async deleteToDo(
    user: UserIdAndUsername,
    payload: DeleteToDoDto,
  ): Promise<CoreResponse> {
    const toDoInDB = await this.toDoRepository.findOne(payload.id, {
      relations: ['owner'],
    });

    if (!toDoInDB) {
      return {
        isSuccess: false,
        error: CustomError.ToDoNotExist,
      };
    }

    if (toDoInDB.owner.id !== user.id) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    await this.toDoRepository.delete(toDoInDB.id);

    return {
      isSuccess: true,
    };
  }
}
