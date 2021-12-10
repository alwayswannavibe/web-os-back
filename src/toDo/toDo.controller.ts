// Libraries
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

// ToDoLocal
import { ToDoService } from '@app/toDo/toDo.service';
import { AddToDoDto } from '@app/toDo/dtos/addToDo.dto';
import { UpdateToDoDto } from '@app/toDo/dtos/updateToDo.dto';
import { DeleteToDoDto } from '@app/toDo/dtos/deleteToDo.dto';
import { ToDo } from '@app/toDo/entities/ToDo.entity';

// Common
import { User } from '@app/common/decorators/user.decorator';
import { UserIdAndUsername } from '@app/common/interfaces/userIdAndUsername';
import { CoreResponse } from '@app/common/dtos/CoreResponse.dto';

@Controller('toDo')
@ApiTags('ToDo')
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('items')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get to do items' })
  getToDoItems(@User() user: UserIdAndUsername): Promise<ToDo[]> {
    return this.toDoService.getToDoItems(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  @Post('items')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Add item to to do list' })
  addToDo(
    @User() user: UserIdAndUsername,
    @Body() payload: AddToDoDto,
  ): Promise<CoreResponse> {
    return this.toDoService.addToDo(user, payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  @Put('items')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update item in to do list' })
  updateToDo(
    @User() user: UserIdAndUsername,
    @Body() payload: UpdateToDoDto,
  ): Promise<CoreResponse> {
    return this.toDoService.updateToDo(user, payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  @Delete('items')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete item from to do list' })
  deleteToDo(
    @User() user: UserIdAndUsername,
    @Body() payload: DeleteToDoDto,
  ): Promise<CoreResponse> {
    return this.toDoService.deleteToDo(user, payload);
  }
}
