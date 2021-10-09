import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { UserModule } from '@app/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/user/entities/user.entity';
import { AuthController } from '@app/auth/auth.controller';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [UserModule, PassportModule, TypeOrmModule.forFeature([User])],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
