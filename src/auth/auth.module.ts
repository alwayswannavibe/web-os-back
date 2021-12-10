// Libraries
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

// Auth
import { AuthService } from '@app/auth/auth.service';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { AuthController } from '@app/auth/auth.controller';

// User
import { UserModule } from '@app/user/user.module';
import { User } from '@app/user/entities/user.entity';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [UserModule, PassportModule, TypeOrmModule.forFeature([User])],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
