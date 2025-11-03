import { PrismaService } from '@app/shared/prisma/prisma.service';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { Injectable } from '@nestjs/common';
import { CreateRiceDto } from './dto/create-rice.dto';
import { RiceMapper } from './mapper/rice.mapper';
import { RiceEntity } from './entity/rice.entity';

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
}
