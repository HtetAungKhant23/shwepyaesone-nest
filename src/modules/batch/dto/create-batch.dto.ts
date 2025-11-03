import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class BatchItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  riceId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

export class CreateBatchDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  supplierId: string;

  @ApiProperty({ type: [BatchItemDto] })
  @IsNotEmpty()
  @IsArray()
  items: BatchItemDto[];
}
