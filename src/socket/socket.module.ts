// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Socket
import { SocketEntity } from '@app/socket/entities/socket.entity';
import { SocketService } from '@app/socket/socket.service';

//Auth
import { AuthModule } from '@app/auth/auth.module';

// User
import { User } from '@app/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocketEntity, User]), AuthModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
