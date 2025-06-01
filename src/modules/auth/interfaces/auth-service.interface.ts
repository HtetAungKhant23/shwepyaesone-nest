import { EmailVerifyDto } from '../dto/email-verify.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserEntity } from '../entities/user.entity';

export interface IAuthService {
  register(dto: RegisterDto): Promise<number>;
  verifyEmail(dto: EmailVerifyDto): Promise<boolean>;
  resendOtp(email: string): Promise<number>;
  login(dto: LoginDto): Promise<string>;
  getMe(id: string): Promise<UserEntity>;
}
