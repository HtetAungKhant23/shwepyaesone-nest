import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { hashText, verifyText } from '@app/utils/hashText';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { IAuthService } from './interfaces/auth-service.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<number> {
    const existUser = await this.dbService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existUser && existUser.isVerify) {
      throw new BadRequestException({
        message: `User already exist`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
      });
    }

    if (!existUser) {
      await this.dbService.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: await hashText(dto.password),
        },
      });
    }

    const code: number = await this.createOtp(dto.email);
    return code;
  }

  async login(dto: LoginDto): Promise<string> {
    const existUser = await this.dbService.user.findUnique({
      where: {
        email: dto.email,
        isDeleted: false,
        isVerify: true,
      },
    });

    if (!existUser) {
      throw new BadRequestException({
        message: `User not found`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    const matchPw = await verifyText(existUser.password, dto.password);

    if (!matchPw) {
      throw new BadRequestException({
        message: `Wrong credential`,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }

    return this.generateToken(existUser.id, existUser.email, process.env.USER_SECRET_KEY as string);
  }

  async getMe(id: string): Promise<UserEntity> {
    const user = await this.dbService.user.findUnique({
      where: {
        id,
      },
    });

    return new UserEntity(user?.name || '', user?.email || '');
  }

  async verifyEmail(dto: EmailVerifyDto): Promise<boolean> {
    const otp = await this.dbService.otp.findUnique({
      where: {
        email: dto.email,
        code: dto.code,
        expiredAt: {
          gte: dayjs().toDate(),
        },
      },
    });

    if (!otp) {
      throw new BadRequestException({
        message: `Invalid code`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    await this.dbService.user.update({
      where: {
        email: dto.email,
      },
      data: {
        isVerify: true,
      },
    });
    await this.dbService.otp.delete({
      where: {
        id: otp.id,
      },
    });

    return true;
  }

  async resendOtp(email: string): Promise<number> {
    const existUser = await this.dbService.user.findUnique({
      where: {
        email,
        isDeleted: false,
        isVerify: false,
      },
    });
    if (!existUser) {
      throw new BadRequestException({
        message: `Email not found`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }
    const code: number = await this.createOtp(email);
    return code;
  }

  private async createOtp(email: string): Promise<number> {
    const code: number = Math.floor(100000 + Math.random() * 900000);

    await this.dbService.otp.upsert({
      where: {
        email,
      },
      create: {
        email,
        code: code.toString(),
        expiredAt: dayjs(Date.now()).add(1, 'minute').toDate(),
      },
      update: {
        code: code.toString(),
        expiredAt: dayjs(Date.now()).add(1, 'minute').toDate(),
      },
    });

    return code;
  }

  private async generateToken(id: string, email: string, secretKey: string): Promise<string> {
    const token: string = await this.jwtService.signAsync(
      { id, email },
      {
        secret: secretKey,
        expiresIn: '1m',
      },
    );
    return token;
  }
}
