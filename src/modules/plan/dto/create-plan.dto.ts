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

export class CreatePlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recipeName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recipeImgUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  instruction: string;

  @ApiProperty({ type: [IngredientDto] })
  @IsNotEmpty()
  ingredients: IngredientDto[];
}
