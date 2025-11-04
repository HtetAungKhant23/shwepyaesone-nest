/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { BatchMapper } from './mapper/batch.mapper';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchEntity, PopulatedBatchEntity } from './entity/batch.entity';
import { StoreToWarehouseDto } from './dto/store-to-warehouse.dto';
import { FilterTypeEnum, GetBatchBySupplier } from './dto/get-batch-by-supplier.dto';

@Injectable()
export class BatchService {
  constructor(private readonly dbService: PrismaService) {}

  async getBatchBySupplier(dto: GetBatchBySupplier): Promise<PopulatedBatchEntity[]> {
    try {
      const filter = dto.filter === FilterTypeEnum.all ? {} : dto.filter === FilterTypeEnum.paid ? { paid: true } : { paid: false };
      const batches = await this.dbService.batch.findMany({
        where: {
          supplierId: dto.supplierId,
          ...filter,
        },
        include: {
          items: {
            include: {
              rice: true,
            },
          },
          creator: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: +dto.size,
        skip: (+dto.page - 1) * +dto.size,
      });
      return BatchMapper.toDomainPopulatedArray(batches);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async getBatchDetail(id: string): Promise<PopulatedBatchEntity> {
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
          creator: true,
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
      dto.items.map(async (item) => {
        totalStock += item?.stock || 0;
        await this.dbService.batchItem.create({
          data: {
            totalStock: item?.stock || 0,
            remainStock: item?.stock || 0,
            riceId: item?.riceId || '',
            batchId: newBatch.id,
          },
        });
      });

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
          creator: true,
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
          storeInWarehouse: false,
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

      await this.dbService.$transaction(async (tx) => {
        let totalStoreStock = 0;
        for (const item of batch.items) {
          const toStoreStock = item?.remainStock || 0;
          totalStoreStock += toStoreStock;
          const whItem = warehouse.items.find((d) => d.riceId === item?.riceId);
          // set remain stock to 0
          await tx.batchItem.update({
            where: { id: item.id },
            data: { remainStock: 0 },
          });
          await tx.warehouseItem.upsert({
            where: { id: whItem ? whItem.id : '' },
            create: {
              stock: toStoreStock,
              riceId: item?.riceId || '',
              warehouseId: warehouse.id,
            },
            update: {
              stock: { increment: toStoreStock },
            },
          });
          // create warehouse stock history
          await tx.warehouseStockHistory.create({
            data: {
              stock: toStoreStock,
              riceId: item?.riceId || '',
              creatorId: dto.adminId,
              fromBatchId: batch.id,
              toWarehouseId: warehouse.id,
            },
          });
        }
        // set storeToWarehouse true
        await tx.batch.update({
          where: { id: batch.id },
          data: { storeInWarehouse: true },
        });
        // increase stock to warehouse
        await tx.warehouse.update({
          where: { id: warehouse.id },
          data: {
            totalStock: { increment: totalStoreStock },
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

  private generateBatchName(no: number): string {
    return `bth-${no + 1}`;
  }
}
