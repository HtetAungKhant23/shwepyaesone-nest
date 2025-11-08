import { Admin, Batch, BatchItem, Rice, Supplier, SupplierPayment, SupplierPaymentItem } from '@prisma/client';
import { SupplierMapper } from '@app/modules/supplier/mapper/supplier.mapper';
import { AdminMapper } from '@app/modules/auth/mapper/admin.mapper';
import { BaseBatch } from '@app/modules/batch/entity/batch.entity';
import { BatchMapper } from '@app/modules/batch/mapper/batch.mapper';
import { PaymentEntity, PaymentItemEntity, PopulatedPaymentEntity } from '../entity/payment.entity';

// JSON.stringify(JSON.parse(prismaData?.serviceCharges?.toString() || '')),

export class PaymentMapper {
  static toDomain(
    prismaData: SupplierPayment & {
      creator: Admin;
    } & {
      batch: Batch & {
        supplier: Supplier;
      };
    } & {
      item: { id: string }[];
    },
  ): PaymentEntity {
    return new PaymentEntity(
      prismaData.id,
      prismaData.totalAmount,
      prismaData?.note || null,
      prismaData.paid,
      AdminMapper.toDomain(prismaData.creator),
      SupplierMapper.toDomain(prismaData.batch.supplier),
      { id: prismaData.batch.id, batchNo: prismaData.batch.batchNo, storeInWarehouse: prismaData.batch.storeInWarehouse },
      prismaData.createdAt,
    );
  }

  static toDomainArray(
    prismaData: (SupplierPayment & {
      creator: Admin;
    } & {
      batch: Batch & {
        supplier: Supplier;
      };
    } & {
      item: { id: string }[];
    })[],
  ): PaymentEntity[] {
    return prismaData.map(this.toDomain.bind(this));
  }

  static toDomainPopulated(
    prismaData: SupplierPayment & {
      creator: Admin;
    } & {
      batch: Batch & {
        supplier: Supplier;
      };
    } & {
      item: (SupplierPaymentItem & { batchItem: BatchItem & { rice: Rice } })[];
    },
  ): PopulatedPaymentEntity {
    const { batch } = prismaData;
    const batchEntity = new BaseBatch();
    batchEntity.id = batch.id;
    batchEntity.batchNo = batch.batchNo;
    batchEntity.totalStock = batch.totalStock;
    batchEntity.paid = batch.paid;
    batchEntity.storeInWarehouse = batch.storeInWarehouse;
    batchEntity.createdAt = batch.createdAt;
    return new PopulatedPaymentEntity(
      prismaData.id,
      prismaData.totalAmount,
      prismaData?.note || null,
      prismaData.serviceCharges?.toString() || '',
      prismaData?.otherExpenses ? prismaData.otherExpenses.toString() : null,
      prismaData.paid,
      AdminMapper.toDomain(prismaData.creator),
      SupplierMapper.toDomain(prismaData.batch.supplier),
      batchEntity,
      this.toDomainItemEntityArray(prismaData.item),
      prismaData.createdAt,
    );
  }

  static toDomainItemEntity(prismaData: SupplierPaymentItem & { batchItem: BatchItem & { rice: Rice } }): PaymentItemEntity {
    const itemEntity = new PaymentItemEntity();
    itemEntity.id = prismaData.id;
    itemEntity.price = prismaData.price;
    itemEntity.qty = prismaData.qty;
    itemEntity.batchItem = BatchMapper.toDomainBatchItem(prismaData.batchItem);
    return itemEntity;
  }

  static toDomainItemEntityArray(prismaData: (SupplierPaymentItem & { batchItem: BatchItem & { rice: Rice } })[]): PaymentItemEntity[] {
    return prismaData.map(this.toDomainItemEntity.bind(this));
  }
}
