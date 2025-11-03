/* eslint-disable no-plusplus */
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { PopulatedItemWarehouseEntity, WarehouseEntity } from './entity/warehouse.entity';
import { WarehouseMapper } from './mapper/warehouse.mapper';

@Injectable()
export class WarehouseService {
  constructor(private readonly dbService: PrismaService) {}

  async getWarehouseDetail(id: string): Promise<PopulatedItemWarehouseEntity> {
    try {
      const warehouses = await this.dbService.warehouse.findUnique({
        where: {
          id,
          deleted: false,
        },
        include: {
          items: {
            include: {
              rice: true,
            },
          },
        },
      });

      if (!warehouses) {
        throw new Error('warehouse not found');
      }
      return WarehouseMapper.toDomainPopulatedItemWarehouseEntity(warehouses);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async getWarehouses(): Promise<WarehouseEntity[]> {
    try {
      const warehouses = await this.dbService.warehouse.findMany({
        where: {
          deleted: false,
        },
        include: {
          items: {
            select: {
              id: true,
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

  async createWarehouse(dto: CreateWarehouseDto & { adminId: string }) {
    try {
      const nameExist = await this.dbService.warehouse.findFirst({
        where: {
          name: dto.name,
          deleted: false,
        },
      });
      if (nameExist) {
        throw new Error('warehouse name already exist');
      }

      const warehouse = await this.dbService.warehouse.create({
        data: {
          name: dto.name,
          address: dto.address,
          creatorId: dto.adminId,
        },
        include: {
          items: {
            select: {
              id: true,
            },
          },
        },
      });

      return WarehouseMapper.toDomain(warehouse);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async transferStock(dto: TransferStockDto & { fromId: string; adminId: string }) {
    try {
      const fromWarehouse = await this.dbService.warehouse.findUnique({
        where: {
          id: dto.fromId,
          deleted: false,
        },
        include: {
          items: true,
        },
      });
      if (!fromWarehouse) {
        throw new Error('warehouse not found');
      }

      const toWarehouse = await this.dbService.warehouse.findUnique({
        where: {
          id: dto.toId,
          deleted: false,
        },
        include: {
          items: true,
        },
      });
      if (!toWarehouse) {
        throw new Error('warehouse not found');
      }

      for (let i = 0; i < dto.stocks.length; i++) {
        const newItem = dto.stocks[i];
        const fromWarehouseItem = fromWarehouse.items.find((item) => item.riceId === newItem?.riceId);
        const toWarehouseItem = toWarehouse.items.find((item) => item.riceId === newItem?.riceId);
        this.dbService.$transaction(async (tx) => {
          // reduce stock fromWarehouse
          tx.warehouse.update({
            where: {
              id: fromWarehouse.id,
            },
            data: {
              totalStock: {
                decrement: newItem?.stock || 0,
              },
            },
          });
          tx.warehouseItem.update({
            where: {
              id: fromWarehouseItem?.id,
            },
            data: {
              stock: {
                decrement: newItem?.stock || 0,
              },
            },
          });
          // increase stock toWarehouse
          tx.warehouse.update({
            where: {
              id: toWarehouse.id,
            },
            data: {
              totalStock: {
                increment: newItem?.stock || 0,
              },
            },
          });
          tx.warehouseItem.upsert({
            where: {
              id: toWarehouseItem?.id || '',
            },
            create: {
              stock: newItem?.stock || 0,
              riceId: newItem?.riceId || '',
              warehouseId: toWarehouse.id,
            },
            update: {
              stock: {
                increment: newItem?.stock || 0,
              },
            },
          });
          // create warehouse stock history
          tx.warehouseStockHistory.create({
            data: {
              stock: newItem?.stock || 0,
              riceId: newItem?.riceId || '',
              creatorId: dto.adminId,
              fromWarehouseId: fromWarehouse.id,
              toWarehouseId: toWarehouse.id,
            },
          });
        });
      }
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }
}
