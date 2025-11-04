import { Admin, Batch, BatchItem, Rice } from '@prisma/client';
import { AdminMapper } from '@app/modules/auth/mapper/admin.mapper';
import { RiceMapper } from '@app/modules/rice/mapper/rice.mapper';
import { BatchEntity, BatchItemEntity, PopulatedBatchEntity } from '../entity/batch.entity';

export class BatchMapper {
  static toDomain(
    prismaData: Batch & {
      items: {
        id: string;
      }[];
    } & { creator: Admin },
  ): BatchEntity {
    return new BatchEntity(
      prismaData.id,
      prismaData.batchNo,
      prismaData.totalStock,
      prismaData.paid,
      prismaData.storeInWarehouse,
      prismaData.items.map((d) => d.id),
      AdminMapper.toDomain(prismaData.creator),
      prismaData.createdAt,
    );
  }

  static toDomainArray(
    prismaData: (Batch & {
      items: {
        id: string;
      }[];
    } & { creator: Admin })[],
  ): BatchEntity[] {
    return prismaData.map(this.toDomain);
  }

  static toDomainPopulated(
    prismaData: Batch & {
      items: (BatchItem & {
        rice: Rice;
      })[];
    } & { creator: Admin },
  ): PopulatedBatchEntity {
    return new PopulatedBatchEntity(
      prismaData.id,
      prismaData.batchNo,
      prismaData.totalStock,
      prismaData.paid,
      prismaData.storeInWarehouse,
      this.toDomainBatchItemArray(prismaData.items),
      AdminMapper.toDomain(prismaData.creator),
      prismaData.createdAt,
    );
  }

  static toDomainBatchItem(prismaData: BatchItem & { rice: Rice }): BatchItemEntity {
    return new BatchItemEntity(
      prismaData.id,
      prismaData.totalStock,
      prismaData.remainStock,
      prismaData.paidQty,
      prismaData.paid,
      RiceMapper.toDomain(prismaData.rice),
      prismaData.createdAt,
    );
  }

  static toDomainBatchItemArray(prismaData: (BatchItem & { rice: Rice })[]): BatchItemEntity[] {
    return prismaData.map(this.toDomainBatchItem.bind(this));
  }
}
