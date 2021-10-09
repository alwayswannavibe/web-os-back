// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// User
import { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/user.service';

// Chat
import { Message } from '@app/chat/entities/Message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
