// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

// Chat
import { ChatModule } from '@app/chat/chat.module';
import { Message } from '@app/chat/entities/Message.entity';

// Auth
import { AuthModule } from '@app/auth/auth.module';

// User
import { User } from '@app/user/entities/user.entity';
import { UserModule } from '@app/user/user.module';
import { UserController } from '@app/user/user.controller';

// Room
import { Room } from './room/entities/Room.entity';
import { RoomModule } from '@app/room/room.module';

// Socket
import { SocketEntity } from '@app/socket/entities/socket.entity';
import { SocketModule } from '@app/socket/socket.module';

// Jwt
import { JwtLocalModule } from '@app/jwt/jwtLocal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: joi.object({
        NODE_ENV: joi.string().valid('dev', 'prod', 'test'),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.string().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_DATABASE: joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: false,
      entities: [Message, User, SocketEntity, Room],
      ssl: process.env.NODE_ENV === 'prod' && { rejectUnauthorized: false },
    }),
    ChatModule,
    AuthModule,
    UserModule,
    SocketModule,
    JwtLocalModule,
    RoomModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
