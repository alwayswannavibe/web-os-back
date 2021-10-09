// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Room
import { RoomController } from '@app/room/room.controller';
import { Room } from '@app/room/entities/Room.entity';
import { RoomService } from '@app/room/room.service';

// User
import { User } from '@app/user/entities/user.entity';

// Chat
import { Message } from '@app/chat/entities/Message.entity';

@Module({
  controllers: [RoomController],
  imports: [TypeOrmModule.forFeature([Room, User, Message])],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
