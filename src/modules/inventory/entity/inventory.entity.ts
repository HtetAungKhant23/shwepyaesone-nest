import { RiceEntity } from '@app/modules/rice/entity/rice.entity';
import { SupplierEntity } from '@app/modules/supplier/entity/supplier.entity';

export class RiceBySupplierEntity {
  id: string;

  buyingPrice: number;

  sellingPrice: number;

  totalStock: number;

  remainStock: number;

  rice: RiceEntity;

  supplier: SupplierEntity;

  createdAt: Date;

  updatedAt: Date;
}

export class InventoryEntity {
  id: string;

  name: string;

  totalStock: number;

  riceBySupplier: RiceBySupplierEntity[];

  createdAt: Date;

  updatedAt: Date;
}
