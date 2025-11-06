import { PaginationDto } from '@app/core/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum FilterTypeEnum {
  'all' = 'all',
  'paid' = 'paid',
  'unpaid' = 'unpaid',
}

export class GetAllTransactionDto extends PaginationDto {
  @ApiProperty({ type: String, enum: FilterTypeEnum, default: FilterTypeEnum.all })
  @IsNotEmpty()
  @IsEnum(FilterTypeEnum)
  filter: FilterTypeEnum;
}
