import { Inventory, Rice, RiceBySupplier, Supplier } from '@prisma/client';
import { RiceMapper } from '@app/modules/rice/mapper/rice.mapper';
import { InventoryEntity } from '../entity/inventory.entity';

export class InventoryMapper {
  static toDomain(
    prismaData: Inventory & {
      riceBySupplier: (RiceBySupplier & {
        rice: Rice;
        supplier: Supplier;
      })[];
    },
  ): InventoryEntity {
    const entity = new InventoryEntity();
    entity.id = prismaData.id;
    entity.name = prismaData.name;
    entity.totalStock = prismaData.totalStock;
    entity.riceBySupplier = RiceMapper.riceBySupplierToDomainArray(prismaData.riceBySupplier);
    entity.createdAt = prismaData.createdAt;
    entity.updatedAt = prismaData.updatedAt;
    return entity;
  }

  static toDomainArray(
    prismaData: (Inventory & {
      riceBySupplier: (RiceBySupplier & {
        rice: Rice;
        supplier: Supplier;
      })[];
    })[],
  ): InventoryEntity[] {
    return prismaData.map(this.toDomain);
  }
}
