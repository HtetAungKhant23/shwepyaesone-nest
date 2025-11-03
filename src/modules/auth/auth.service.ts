import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { NotFoundException, UnauthorizedException } from '@app/core/exceptions';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { hashText, verifyText } from '@app/utils/hashText';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { IAuthService } from './interfaces/auth-service.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly dbService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<number> {
    const adminExist = await this.dbService.admin.findUnique({
      where: {
        email: dto.email,
        deleted: false,
      },
    });

    if (adminExist && adminExist.isVerify) {
      throw new BadRequestException({
        message: `Admin already exist`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
      });
    }

    if (!adminExist) {
      await this.dbService.admin.create({
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
    const adminExist = await this.dbService.admin.findUnique({
      where: {
        email: dto.email,
        deleted: false,
        isVerify: true,
      },
    });

    if (!adminExist) {
      throw new NotFoundException({
        message: `Admin not found`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    const matchPw = await verifyText(adminExist.password, dto.password);

    if (!matchPw) {
      throw new UnauthorizedException({
        message: `Wrong credential`,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }

    return this.generateToken(adminExist.id, adminExist.email, process.env.USER_SECRET_KEY as string);
  }

  async getMe(id: string): Promise<AdminEntity> {
    const admin = await this.dbService.admin.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      throw new NotFoundException({
        message: 'Admin not found',
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    return new AdminEntity(admin.id, admin.name, admin.email, admin.isVerify, admin.deleted);
  }

  async verifyEmail(dto: EmailVerifyDto): Promise<string> {
    const otp = await this.dbService.otp.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!otp) {
      throw new BadRequestException({
        message: `Invalid format`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    if (otp.code !== dto.code) {
      throw new UnauthorizedException({
        message: `Invalid OTP code`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    if (dayjs().toDate() >= otp.expiredAt) {
      throw new UnauthorizedException({
        message: `OTP expired`,
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
      });
    }

    const adminVerified = await this.dbService.admin.update({
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

    return this.generateToken(adminVerified.id, adminVerified.email, process.env.USER_SECRET_KEY as string);
  }

  async resendOtp(email: string): Promise<number> {
    const adminExist = await this.dbService.admin.findUnique({
      where: {
        email,
        deleted: false,
        isVerify: false,
      },
    });
    if (!adminExist) {
      throw new BadRequestException({
        message: `Admin not found`,
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
        expiredAt: dayjs(Date.now()).add(3, 'minute').toDate(),
      },
      update: {
        code: code.toString(),
        expiredAt: dayjs(Date.now()).add(3, 'minute').toDate(),
      },
    });

    return code;
  }

  private async generateToken(id: string, email: string, secretKey: string): Promise<string> {
    const token: string = await this.jwtService.signAsync(
      { id, email },
      {
        secret: secretKey,
        expiresIn: '1h',
      },
    );
    return token;
  }
}
