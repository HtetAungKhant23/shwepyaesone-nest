import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Auth')
@Controller({
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: IAuthService,
    private readonly mailService: EmailService,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async getMe(@CurrentUser() user: IAuthUser) {
    const res = await this.authService.getMe(user.id);
    return {
      _data: res,
      _metadata: {
        success: true,
        message: 'Me successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: RegisterDto, description: 'Register.' })
  async register(@Body() dto: RegisterDto) {
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
        success: true,
        message: 'Register success.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ResendOtpDto, description: 'Otp resend.' })
  async resendOtp(@Body() dto: ResendOtpDto) {
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
        success: true,
        message: 'Resend otp success.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: EmailVerifyDto, description: 'Verify Email.' })
  async verifyEmail(@Body() dto: EmailVerifyDto) {
    const token = await this.authService.verifyEmail(dto);
    return {
      _data: { token },
      _metadata: {
        success: true,
        message: 'Email verify success.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto, description: 'Login.' })
  async login(@Body() dto: LoginDto) {
    const token: string = await this.authService.login(dto);
    return {
      _data: { token },
      _metadata: {
        success: true,
        message: 'Login success.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
