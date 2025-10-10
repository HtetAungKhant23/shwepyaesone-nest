import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { Warehouse, Rice, RiceBySupplier, Supplier } from '@prisma/client';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { AddRiceDto } from './dto/add-rice.dto';
import { WarehouseEntity } from './entity/warehouse.entity';
import { WarehouseMapper } from './mapper/warehouse.mapper';

@Injectable()
export class WarehouseService {
  constructor(private readonly dbService: PrismaService) {}

  async getWarehouses(): Promise<WarehouseEntity[]> {
    try {
      const warehouses: (Warehouse & {
        riceBySupplier: (RiceBySupplier & {
          rice: Rice;
          supplier: Supplier;
        })[];
      })[] = await this.dbService.warehouse.findMany({
        where: {
          deleted: false,
        },
        include: {
          riceBySupplier: {
            include: {
              rice: true,
              supplier: true,
            },
          },
        },
      });

      return WarehouseMapper.toDomainArray(warehouses);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createWarehouse(dto: CreateWarehouseDto) {
    try {
      return await this.dbService.warehouse.create({
        data: {
          name: dto.name,
          address: dto.address,
        },
      });
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async addRice(dto: AddRiceDto & { id: string }) {
    try {
      const riceAddedToWarehouse = await this.dbService.riceBySupplier.create({
        data: {
          warehouseId: dto.id,
          riceId: dto.riceId,
          supplierId: dto.supplierId,
          buyingPrice: dto.buyingPrice,
          sellingPrice: dto.sellingPrice,
          totalStock: dto.stock,
          remainStock: dto.stock,
        },
      });
      await this.dbService.warehouse.update({
        where: {
          id: dto.id,
        },
        data: {
          totalStock: {
            increment: dto.stock,
          },
        },
      });
      return riceAddedToWarehouse;
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }
}
