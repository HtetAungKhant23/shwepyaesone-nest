import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

class IngredientsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  qty: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  bought: boolean;
}

export class MakeIngredientsBoughtDto {
  @ApiProperty({ type: [IngredientsDto] })
  @IsNotEmpty()
  ingredients: IngredientsDto[];
}
