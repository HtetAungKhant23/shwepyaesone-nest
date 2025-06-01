import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly dbService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.USER_SECRET_KEY,
    });
  }

  async validate(payload: { id: string; email: string }) {
    const user = await this.dbService.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      throw new Error('Invalid token.');
    }
    return { id: payload.id, email: payload.email };
  }
}
