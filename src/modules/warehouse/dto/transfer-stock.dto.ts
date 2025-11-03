import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class StockDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  riceId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

export class TransferStockDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toId: string;

  @ApiProperty({ type: [StockDto] })
  @IsNotEmpty()
  @IsArray()
  stocks: StockDto[];
}
