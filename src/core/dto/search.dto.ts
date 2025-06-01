import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SearchDto {
  @ApiPropertyOptional({
    example: 'U Myint Maung',
  })
  @Type(() => String)
  @IsOptional()
  readonly search?: string = '';
}
