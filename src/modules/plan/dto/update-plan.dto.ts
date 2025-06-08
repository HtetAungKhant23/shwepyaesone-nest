import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class IngredientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  qty: string;
}

export class UpdatePlanDto {
  @ApiProperty({ type: [IngredientDto] })
  @IsNotEmpty()
  ingredients: IngredientDto[];
}
