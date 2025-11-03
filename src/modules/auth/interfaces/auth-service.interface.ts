import { EmailVerifyDto } from '../dto/email-verify.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AdminEntity } from '../entities/admin.entity';

export interface IAuthService {
  register(dto: RegisterDto): Promise<number>;
  verifyEmail(dto: EmailVerifyDto): Promise<string>;
  resendOtp(email: string): Promise<number>;
  login(dto: LoginDto): Promise<string>;
  getMe(id: string): Promise<AdminEntity | null>;
}
