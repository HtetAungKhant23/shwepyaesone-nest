/* eslint-disable no-useless-escape */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class PaymentItemDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  batchItemId: string;
}

export class CreatePaymentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  batchId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: String,
    example: `{\"brokerageFee\":30000,\"storageFee\":50000,\"workerFee\":20000,\"transportationFee\":10000,\"deliveryFee\":10000}`,
  }) // JSON
  serviceCharges: string;

  @ApiProperty({ type: Boolean, default: false })
  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;

  @ApiProperty({ type: [PaymentItemDto] })
  @IsNotEmpty()
  @IsArray()
  items: PaymentItemDto[];
}
