/* eslint-disable max-classes-per-file */
import { AdminEntity } from '@app/modules/auth/entities/admin.entity';
import { BaseBatch, BatchItemEntity } from '@app/modules/batch/entity/batch.entity';
import { SupplierEntity } from '@app/modules/supplier/entity/supplier.entity';

class BasePayment {
  id: string;

  totalAmount: number;

  note: string | null;

  serviceCharges: string;

  otherExpenses: string | null;

  paid: boolean;

  creator: AdminEntity;

  supplier: SupplierEntity;

  createdAt: Date;
}

export class PaymentItemEntity {
  id: string;

  price: number;

  qty: number;

  batchItem: BatchItemEntity;
}

export class PaymentEntity extends BasePayment {
  batchId: string;

  items: string[];

  constructor(
    id: string,
    totalAmount: number,
    note: string | null,
    serviceCharges: string,
    otherExpenses: string | null,
    paid: boolean,
    creator: AdminEntity,
    supplier: SupplierEntity,
    batchId: string,
    items: string[],
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.totalAmount = totalAmount;
    this.note = note;
    this.serviceCharges = serviceCharges;
    this.otherExpenses = otherExpenses;
    this.paid = paid;
    this.creator = creator;
    this.supplier = supplier;
    this.batchId = batchId;
    this.items = items;
    this.createdAt = createdAt;
  }
}

export class PopulatedPaymentEntity extends BasePayment {
  batch: BaseBatch;

  items: PaymentItemEntity[];

  constructor(
    id: string,
    totalAmount: number,
    note: string | null,
    serviceCharges: string,
    otherExpenses: string | null,
    paid: boolean,
    creator: AdminEntity,
    supplier: SupplierEntity,
    batch: BaseBatch,
    items: PaymentItemEntity[],
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.totalAmount = totalAmount;
    this.note = note;
    this.serviceCharges = serviceCharges;
    this.otherExpenses = otherExpenses;
    this.paid = paid;
    this.creator = creator;
    this.supplier = supplier;
    this.batch = batch;
    this.items = items;
    this.createdAt = createdAt;
  }
}
