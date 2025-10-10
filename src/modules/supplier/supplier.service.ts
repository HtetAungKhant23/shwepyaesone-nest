import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierEntity } from './entity/supplier.entity';
import { SupplierMapper } from './mapper/supplier.mapper';

@Injectable()
export class SupplierService {
  constructor(private readonly dbService: PrismaService) {}

  async getAllSupplier(): Promise<SupplierEntity[]> {
    try {
      const suppliers = await this.dbService.supplier.findMany({ where: { deleted: false } });
      return SupplierMapper.toDomainArray(suppliers);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createSupplier(dto: CreateSupplierDto): Promise<SupplierEntity> {
    try {
      const supplier = await this.dbService.supplier.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          address: dto?.address,
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
