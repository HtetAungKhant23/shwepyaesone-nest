import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StoreToWarehouseDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  warehouseId: string;
}
