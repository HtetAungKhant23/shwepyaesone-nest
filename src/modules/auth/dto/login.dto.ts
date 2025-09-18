import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, required: true, default: 'htetaung23.ha@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true, default: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
