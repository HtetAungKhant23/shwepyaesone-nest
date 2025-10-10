import { PrismaService } from '@app/shared/prisma/prisma.service';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { Injectable } from '@nestjs/common';
import { CreateRiceCategoryDto } from './dto/create-rice-category.dto';
import { CreateRiceDto } from './dto/create-rice.dto';
import { PopulatedRiceEntity, RiceCategoryEntity } from './entity/rice.entity';
import { RiceMapper } from './mapper/rice.mapper';

@Injectable()
export class RiceService {
  constructor(private readonly dbService: PrismaService) {}

  async getAllRice(): Promise<PopulatedRiceEntity[]> {
    try {
      const rice = await this.dbService.rice.findMany({
        where: {
          deleted: false,
        },
        include: {
          category: true,
        },
      });
      return RiceMapper.toDomainPopulatedArray(rice);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createRice(dto: CreateRiceDto): Promise<PopulatedRiceEntity> {
    try {
      const rice = await this.dbService.rice.create({
        data: {
          name: dto.name,
          categoryId: dto.categoryId,
        },
        include: {
          category: true,
        },
      });
      return RiceMapper.toDomainPopulated(rice);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async deleteRice(riceId: string): Promise<void> {
    try {
      await this.dbService.rice.update({
        where: { id: riceId },
        data: { deleted: true },
      });
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

  async deleteRiceCategory(categoryId: string): Promise<void> {
    try {
      await this.dbService.riceCategory.update({
        where: { id: categoryId },
        data: { deleted: true },
      });
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }
}
