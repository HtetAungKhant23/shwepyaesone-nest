import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddRiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  riceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  buyingPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
