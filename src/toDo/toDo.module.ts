// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// User
import { User } from '@app/user/entities/user.entity';

// ToDoLocal
import { ToDoService } from '@app/toDo/toDo.service';
import { ToDoController } from '@app/toDo/toDo.controller';
import { ToDo } from '@app/toDo/entities/ToDo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ToDo])],
  providers: [ToDoService],
  controllers: [ToDoController],
})
export class ToDoModule {}
