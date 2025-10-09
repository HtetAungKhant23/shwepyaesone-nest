import { UnauthorizedException } from '@app/core/exceptions';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAuthGuard extends AuthGuard('user') {
  private readonly logger = new Logger(UserAuthGuard.name);

  handleRequest(err: any, user: any) {
    if (err || !user) {
      this.logger.error({
        message: 'UserAuthGuard: Invalid token',
        error: err || 'Invalid token (no user)',
      });
      throw new UnauthorizedException({
        message: err?.message || 'Invalid token',
        code: ExceptionConstants.UnauthorizedCodes.ACCESS_TOKEN_EXPIRED,
        description: 'Invalid or Expire token',
      });
    }
    return user;
  }
}
