import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManualPlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recipeName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  instruction: string;

  @ApiProperty({ type: String })
  ingredients: string;
}
