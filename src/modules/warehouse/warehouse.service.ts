/* eslint-disable no-await-in-loop */
/* eslint-disable curly */
/* eslint-disable no-restricted-syntax */
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
      const warehouseItemIds: string[] = dto.stocks.map((stock) => stock.warehouseItemId);
      const fromWarehouse = await this.dbService.warehouse.findUnique({
        where: {
          id: dto.fromId,
          deleted: false,
          items: {
            some: {
              id: { in: warehouseItemIds },
            },
          },
        },
        include: {
          items: true,
        },
      });
      if (!fromWarehouse) {
        throw new Error('warehouse or warehouseItem not found');
      }

      // validate warehouse item and stock
      for (const stockItem of dto.stocks) {
        const fromItem = fromWarehouse.items.find((i) => i.id === stockItem.warehouseItemId);
        if (!fromItem) throw new Error('warehouse item not found');
        if (fromItem.stock < (stockItem.stock || 0)) throw new Error('not enough stock');
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
        throw new Error('destination warehouse not found');
      }

      await this.dbService.$transaction(async (tx) => {
        let totalUpdatedStock = 0;
        for (const stockItem of dto.stocks) {
          totalUpdatedStock += stockItem.stock;
          const fromItem = fromWarehouse.items.find((item) => item.id === stockItem.warehouseItemId);
          const toItem = toWarehouse.items.find((item) => item.riceId === fromItem?.riceId);
          // update warehouse item stock
          await tx.warehouseItem.update({
            where: {
              id: fromItem?.id,
            },
            data: {
              stock: {
                decrement: stockItem?.stock || 0,
              },
            },
          });
          await tx.warehouseItem.upsert({
            where: {
              id: toItem?.id || '',
            },
            create: {
              stock: stockItem?.stock || 0,
              riceId: fromItem?.riceId || '',
              warehouseId: toWarehouse.id,
            },
            update: {
              stock: {
                increment: stockItem?.stock || 0,
              },
            },
          });
          // create warehouse stock history
          await tx.warehouseStockHistory.create({
            data: {
              stock: stockItem?.stock || 0,
              riceId: fromItem?.riceId || '',
              creatorId: dto.adminId,
              fromWarehouseId: fromWarehouse.id,
              toWarehouseId: toWarehouse.id,
            },
          });
        }

        // reduce totalStock fromWarehouse
        await tx.warehouse.update({
          where: {
            id: fromWarehouse.id,
          },
          data: {
            totalStock: {
              decrement: totalUpdatedStock,
            },
          },
        });
        // increase totalStock toWarehouse
        await tx.warehouse.update({
          where: {
            id: toWarehouse.id,
          },
          data: {
            totalStock: {
              increment: totalUpdatedStock,
            },
          },
        });
      });
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }
}
