import { Module } from '@nestjs/common';
import EmailService from '@app/shared/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { UserStrategy } from '../auth/strategy/user.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtService, UserStrategy],
  exports: [AuthService],
})
export class RoutesAuthModule {}
