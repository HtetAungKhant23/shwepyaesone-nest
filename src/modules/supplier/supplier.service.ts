import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { PopulatedSupplierEntity, SupplierEntity } from './entity/supplier.entity';
import { SupplierMapper } from './mapper/supplier.mapper';

@Injectable()
export class SupplierService {
  constructor(private readonly dbService: PrismaService) {}

  async getAllSupplier(): Promise<PopulatedSupplierEntity[]> {
    try {
      const suppliers = await this.dbService.supplier.findMany({
        where: { deleted: false },
        include: {
          batch: {
            include: {
              items: {
                select: {
                  id: true,
                },
              },
              creator: true,
            },
          },
        },
      });
      return SupplierMapper.toDomainPopulatedArray(suppliers);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createSupplier(dto: CreateSupplierDto & { adminId: string }): Promise<SupplierEntity> {
    try {
      const supplier = await this.dbService.supplier.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          address: dto?.address,
          creatorId: dto.adminId,
        },
        include: {
          batch: {
            select: {
              id: true,
            },
          },
        },
      });
      return SupplierMapper.toDomain(supplier);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async deleteSupplier(supplierId: string): Promise<void> {
    try {
      await this.dbService.supplier.update({
        where: { id: supplierId },
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
