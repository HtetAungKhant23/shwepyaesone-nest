/* eslint-disable no-plusplus */
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BatchMapper } from './mapper/batch.mapper';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchEntity } from './entity/batch.entity';
import { StoreToWarehouseDto } from './dto/store-to-warehouse.dto';

@Injectable()
export class BatchService {
  constructor(private readonly dbService: PrismaService) {}

  async getBatchDetail(id: string) {
    try {
      const batch = await this.dbService.batch.findUnique({
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
      if (!batch) {
        throw new Error('batch not found');
      }
      return BatchMapper.toDomainPopulated(batch);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createBatch(dto: CreateBatchDto & { adminId: string }): Promise<BatchEntity> {
    try {
      const existBatches = await this.dbService.batch.count({
        where: {
          deleted: false,
          supplierId: dto.supplierId,
        },
      });
      const newBatch = await this.dbService.batch.create({
        data: {
          batchNo: this.generateBatchName(existBatches),
          supplierId: dto.supplierId,
          creatorId: dto.adminId,
        },
      });
      let totalStock = 0;
      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        totalStock += item?.stock || 0;
        this.dbService.batchItem.create({
          data: {
            totalStock: item?.stock || 0,
            remainStock: item?.stock || 0,
            riceId: item?.riceId || '',
            batchId: newBatch.id,
          },
        });
      }
      const batch = await this.dbService.batch.update({
        where: {
          id: newBatch.id,
        },
        data: {
          totalStock,
        },
        include: {
          items: {
            select: {
              id: true,
            },
          },
        },
      });
      return BatchMapper.toDomain(batch);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async storeToWarehouse(dto: StoreToWarehouseDto & { batchId: string; adminId: string }) {
    try {
      const batch = await this.dbService.batch.findUnique({
        where: {
          id: dto.batchId,
          deleted: false,
        },
        include: {
          items: true,
        },
      });
      if (!batch) {
        throw new Error('batch not found');
      }

      const warehouse = await this.dbService.warehouse.findUnique({
        where: {
          id: dto.warehouseId,
          deleted: false,
        },
        include: {
          items: true,
        },
      });
      if (!warehouse) {
        throw new Error('warehouse not found');
      }

      for (let i = 0; i < batch.items.length; i++) {
        const item = batch.items[i];
        const toStoreStock = item?.remainStock || 0;
        const whItem = warehouse.items.find((d) => d.riceId === item?.riceId);

        this.dbService.$transaction(async (tx) => {
          // set storeToWarehouse true
          tx.batch.update({
            where: {
              id: batch.id,
            },
            data: {
              storeInWarehouse: true,
            },
          });
          // set stock 0 to remain stock
          tx.batchItem.update({
            where: {
              id: item?.id,
            },
            data: {
              remainStock: 0,
            },
          });
          // increase stock toWarehouse
          tx.warehouse.update({
            where: {
              id: warehouse.id,
            },
            data: {
              totalStock: {
                increment: toStoreStock,
              },
            },
          });
          tx.warehouseItem.upsert({
            where: {
              id: whItem?.id || '',
            },
            create: {
              stock: toStoreStock,
              riceId: item?.riceId || '',
              warehouseId: warehouse.id,
            },
            update: {
              stock: {
                increment: toStoreStock,
              },
            },
          });
          // create warehouse stock history
          tx.warehouseStockHistory.create({
            data: {
              stock: toStoreStock,
              riceId: item?.riceId || '',
              creatorId: dto.adminId,
              fromBatchId: batch.id,
              toWarehouseId: warehouse.id,
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

  private generateBatchName(no: number): string {
    return `bth-${no + 1}`;
  }
}
