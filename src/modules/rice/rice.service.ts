import { PrismaService } from '@app/shared/prisma/prisma.service';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { Injectable } from '@nestjs/common';
import { CreateRiceCategoryDto } from './dto/create-rice-category.dto';
import { CreateRiceDto } from './dto/create-rice.dto';

@Injectable()
export class RiceService {
  constructor(private readonly dbService: PrismaService) {}

  async createRice(dto: CreateRiceDto) {
    try {
      return await this.dbService.rice.create({
        data: {
          name: dto.name,
          categoryId: dto.categoryId,
        },
      });
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createRiceCategory(dto: CreateRiceCategoryDto) {
    try {
      return await this.dbService.riceCategory.create({
        data: {
          name: dto.name,
          description: dto?.description,
        },
      });
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }
}
