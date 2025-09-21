import { Rice, RiceBySupplier, RiceCategory, Supplier } from '@prisma/client';
import { RiceBySupplierEntity } from '@app/modules/inventory/entity/inventory.entity';
import { SupplierMapper } from '@app/modules/supplier/mapper/supplier.mapper';
import { RiceCategoryEntity, RiceEntity } from '../entity/rice.entity';

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

  static toDomainArray(prismaData: Rice[]): RiceEntity[] {
    return prismaData.map(this.toDomain);
  }

  static categoryToDomain(prismaData: RiceCategory): RiceCategoryEntity {
    const entity = new RiceCategoryEntity();
    entity.id = prismaData.id;
    entity.name = prismaData.name;
    entity.description = prismaData.description;
    entity.createdAt = prismaData.createdAt;
    entity.updatedAt = prismaData.updatedAt;
    return entity;
  }

  static categoryToDomainArray(prismaData: RiceCategory[]): RiceCategoryEntity[] {
    return prismaData.map(this.categoryToDomain);
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
