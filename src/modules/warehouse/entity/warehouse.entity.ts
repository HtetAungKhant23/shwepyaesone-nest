/* eslint-disable max-classes-per-file */
import { RiceEntity } from '@app/modules/rice/entity/rice.entity';

class BaseWarehouse {
  id: string;

  name: string;

  address: string;

  totalStock: number;

  creatorId: string;

  createdAt: Date;
}

export class WarehouseItemEntity {
  id: string;

  stock: number;

  rice: RiceEntity;

  createdAt: Date;

  updatedAt: Date;

  constructor(id: string, stock: number, rice: RiceEntity, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.stock = stock;
    this.rice = rice;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class WarehouseEntity extends BaseWarehouse {
  items: string[];

  constructor(id: string, name: string, address: string, totalStock: number, items: string[], creatorId: string, createdAt: Date) {
    super();
    this.id = id;
    this.name = name;
    this.address = address;
    this.totalStock = totalStock;
    this.items = items;
    this.creatorId = creatorId;
    this.createdAt = createdAt;
  }
}

export class PopulatedItemWarehouseEntity extends BaseWarehouse {
  items: WarehouseItemEntity[];

  constructor(
    id: string,
    name: string,
    address: string,
    totalStock: number,
    items: WarehouseItemEntity[],
    creatorId: string,
    createdAt: Date,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.address = address;
    this.totalStock = totalStock;
    this.items = items;
    this.creatorId = creatorId;
    this.createdAt = createdAt;
  }
}
