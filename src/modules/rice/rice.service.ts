import { PrismaService } from '@app/shared/prisma/prisma.service';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { Injectable } from '@nestjs/common';
import { CreateRiceCategoryDto } from './dto/create-rice-category.dto';
import { CreateRiceDto } from './dto/create-rice.dto';
import { RiceCategoryEntity, RiceEntity } from './entity/rice.entity';
import { RiceMapper } from './mapper/rice.mapper';

@Injectable()
export class RiceService {
  constructor(private readonly dbService: PrismaService) {}

  async getAllRice(): Promise<RiceEntity[]> {
    try {
      const rice = await this.dbService.rice.findMany({
        where: {
          deleted: false,
        },
      });
      return RiceMapper.toDomainArray(rice);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createRice(dto: CreateRiceDto): Promise<RiceEntity> {
    try {
      const rice = await this.dbService.rice.create({
        data: {
          name: dto.name,
          categoryId: dto.categoryId,
        },
      });
      return RiceMapper.toDomain(rice);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async getAllRiceCategory(): Promise<RiceCategoryEntity[]> {
    try {
      const riceCate = await this.dbService.riceCategory.findMany({
        where: {
          deleted: false,
        },
      });
      return RiceMapper.categoryToDomainArray(riceCate);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createRiceCategory(dto: CreateRiceCategoryDto): Promise<RiceCategoryEntity> {
    try {
      const riceCate = await this.dbService.riceCategory.create({
        data: {
          name: dto.name,
          description: dto?.description,
        },
      });

      return RiceMapper.categoryToDomain(riceCate);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }
}
