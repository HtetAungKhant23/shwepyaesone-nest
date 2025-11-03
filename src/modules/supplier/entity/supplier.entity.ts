/* eslint-disable max-classes-per-file */

import { BatchEntity } from '@app/modules/batch/entity/batch.entity';

class BaseSupplier {
  id: string;

  name: string;

  phone: string[];

  address: string | null;

  createdAt: Date;
}

export class SupplierEntity extends BaseSupplier {
  id: string;

  name: string;

  phone: string[];

  address: string | null;

  batch: string[];

  createdAt: Date;

  constructor(id: string, name: string, phone: string[], createdAt: Date, batch: string[], address: string | null) {
    super();
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address ?? null;
    this.batch = batch;
    this.createdAt = createdAt;
  }
}

export class PopulatedSupplierEntity extends BaseSupplier {
  id: string;

  name: string;

  phone: string[];

  address: string | null;

  batch: BatchEntity[];

  createdAt: Date;

  constructor(id: string, name: string, phone: string[], createdAt: Date, batch: BatchEntity[], address: string | null) {
    super();
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address ?? null;
    this.batch = batch;
    this.createdAt = createdAt;
  }
}
