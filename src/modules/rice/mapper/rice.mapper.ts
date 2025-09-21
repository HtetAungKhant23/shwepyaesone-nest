import { Rice, RiceBySupplier, Supplier } from '@prisma/client';
import { RiceBySupplierEntity } from '@app/modules/inventory/entity/inventory.entity';
import { SupplierMapper } from '@app/modules/supplier/mapper/supplier.mapper';
import { RiceEntity } from '../entity/rice.entity';

export class RiceMapper {
  static toDomain(prismaData: Rice): RiceEntity {
    const entity = new RiceEntity();
    entity.id = prismaData.id;
    entity.name = prismaData.name;
    entity.createdAt = prismaData.createdAt;
    entity.updatedAt = prismaData.updatedAt;
    entity.category = prismaData.categoryId;
    return entity;
  }

  static riceBySupplierToDomain(
    prismaData: RiceBySupplier & {
      rice: Rice;
      supplier: Supplier;
    },
  ): RiceBySupplierEntity {
    const entity = new RiceBySupplierEntity();
    entity.id = prismaData.id;
    entity.buyingPrice = prismaData.buyingPrice;
    entity.sellingPrice = prismaData.sellingPrice;
    entity.totalStock = prismaData.totalStock;
    entity.remainStock = prismaData.remainStock;
    entity.rice = this.toDomain(prismaData.rice);
    entity.supplier = SupplierMapper.toDomain(prismaData.supplier);
    entity.createdAt = prismaData.createdAt;
    entity.updatedAt = prismaData.updatedAt;
    return entity;
  }

  static riceBySupplierToDomainArray(
    prismaData: (RiceBySupplier & {
      rice: Rice;
      supplier: Supplier;
    })[],
  ): RiceBySupplierEntity[] {
    return prismaData.map(this.riceBySupplierToDomain.bind(this));
  }
}
