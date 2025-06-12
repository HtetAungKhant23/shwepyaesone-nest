import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import EmailService from '@app/shared/mail/mail.service';
import { otpTemplate } from '@app/shared/mail/template/otp.template';
import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { AuthService } from './auth.service';
import { IAuthService } from './interfaces/auth-service.interface';
import { RegisterDto } from './dto/register.dto';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginDto } from './dto/login.dto';
import { UserAuthGuard } from './guard/user.auth.guard';

@Controller({
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: IAuthService,
    private readonly mailService: EmailService,
  ) {}

  @ApiTags('Auth')
  @Get('auth/me')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async getMe(@CurrentUser() user: IAuthUser) {
    try {
      const res = await this.authService.getMe(user.id);
      return {
        _data: res,
        _metadata: {
          message: 'Me successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to fetch me',
      });
    }
  }

  @ApiTags('User')
  @Delete('user')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async delete(@CurrentUser() user: IAuthUser) {
    try {
      await this.authService.delete(user.id);
      return {
        _data: {},
        _metadata: {
          message: 'user successfully deleted.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to delete user',
      });
    }
  }

  @ApiTags('Auth')
  @Post('auth/register')
  @ApiBody({ type: RegisterDto, description: 'Register.' })
  async register(@Body() dto: RegisterDto) {
    try {
      const code: number = await this.authService.register(dto);
      await this.mailService.sendMail({
        from: 'spendwise@gmail.com',
        to: dto.email,
        subject: 'Email Verify OTP',
        html: otpTemplate(code),
      });
      return {
        _data: {},
        _metadata: {
          message: 'Register success.',
          statusCode: HttpStatus.CREATED,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to register',
      });
    }
  }

  @ApiTags('Auth')
  @Post('auth/resend-otp')
  @ApiBody({ type: ResendOtpDto, description: 'Otp resend.' })
  async resendOtp(@Body() dto: ResendOtpDto) {
    try {
      const code: number = await this.authService.resendOtp(dto.email);
      await this.mailService.sendMail({
        from: 'spendwise@gmail.com',
        to: dto.email,
        subject: 'Email Verify OTP',
        html: otpTemplate(code),
      });
      return {
        _data: {},
        _metadata: {
          message: 'Resend otp success.',
          statusCode: HttpStatus.NO_CONTENT,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to resend otp',
      });
    }
  }

  @ApiTags('Auth')
  @Post('auth/verify-email')
  @ApiBody({ type: EmailVerifyDto, description: 'Verify Email.' })
  async verfiyEmail(@Body() dto: EmailVerifyDto) {
    try {
      const verify = await this.authService.verifyEmail(dto);
      return {
        _data: { verify },
        _metadata: {
          message: 'Email verify success.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to verify email',
      });
    }
  }

  @ApiTags('Auth')
  @Post('auth/login')
  @ApiBody({ type: LoginDto, description: 'Login.' })
  async login(@Body() dto: LoginDto) {
    try {
      const token: string = await this.authService.login(dto);
      return {
        _data: { token },
        _metadata: {
          message: 'Login success.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to login',
      });
    }
  }
}
