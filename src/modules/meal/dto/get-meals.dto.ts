import { PaginationDto } from '@app/core/dto/pagination.dto';
import { SearchDto } from '@app/core/dto/search.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetMealsDto extends IntersectionType(PaginationDto, SearchDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  categoryId?: string;
}
