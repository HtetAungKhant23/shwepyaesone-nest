import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, required: true, default: 'komyintmyatsoe@icloud.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true, default: '666' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
