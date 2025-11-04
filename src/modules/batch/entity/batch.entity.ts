/* eslint-disable max-classes-per-file */
import { AdminEntity } from '@app/modules/auth/entities/admin.entity';
import { RiceEntity } from '@app/modules/rice/entity/rice.entity';

class BaseBatch {
  id: string;

  batchNo: string;

  totalStock: number;

  paid: boolean;

  storeInWarehouse: boolean;

  creator: AdminEntity;

  createdAt: Date;
}

export class BatchEntity extends BaseBatch {
  items: string[];

  constructor(
    id: string,
    batchNo: string,
    totalStock: number,
    paid: boolean,
    storeInWarehouse: boolean,
    items: string[],
    creator: AdminEntity,
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.batchNo = batchNo;
    this.totalStock = totalStock;
    this.paid = paid;
    this.storeInWarehouse = storeInWarehouse;
    this.items = items;
    this.creator = creator;
    this.createdAt = createdAt;
  }
}

export class PopulatedBatchEntity extends BaseBatch {
  items: BatchItemEntity[];

  constructor(
    id: string,
    batchNo: string,
    totalStock: number,
    paid: boolean,
    storeInWarehouse: boolean,
    items: BatchItemEntity[],
    creator: AdminEntity,
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.batchNo = batchNo;
    this.totalStock = totalStock;
    this.paid = paid;
    this.items = items;
    this.storeInWarehouse = storeInWarehouse;
    this.creator = creator;
    this.createdAt = createdAt;
  }
}

export class BatchItemEntity {
  id: string;

  totalStock: number;

  remainStock: number;

  paidQty: number;

  paid: boolean;

  rice: RiceEntity;

  createdAt: Date;

  constructor(id: string, totalStock: number, remainStock: number, paidQty: number, paid: boolean, rice: RiceEntity, createdAt: Date) {
    this.id = id;
    this.totalStock = totalStock;
    this.remainStock = remainStock;
    this.paidQty = paidQty;
    this.paid = paid;
    this.rice = rice;
    this.createdAt = createdAt;
  }
}
