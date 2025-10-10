import { Warehouse, Rice, RiceBySupplier, Supplier } from '@prisma/client';
import { RiceMapper } from '@app/modules/rice/mapper/rice.mapper';
import { WarehouseEntity } from '../entity/warehouse.entity';

export class WarehouseMapper {
  static toDomain(
    prismaData: Warehouse & {
      riceBySupplier: (RiceBySupplier & {
        rice: Rice;
        supplier: Supplier;
      })[];
    },
  ): WarehouseEntity {
    const entity = new WarehouseEntity();
    entity.id = prismaData.id;
    entity.name = prismaData.name;
    entity.address = prismaData.address;
    entity.totalStock = prismaData.totalStock;
    entity.riceBySupplier = RiceMapper.riceBySupplierToDomainArray(prismaData.riceBySupplier);
    entity.createdAt = prismaData.createdAt;
    entity.updatedAt = prismaData.updatedAt;
    return entity;
  }

  static toDomainArray(
    prismaData: (Warehouse & {
      riceBySupplier: (RiceBySupplier & {
        rice: Rice;
        supplier: Supplier;
      })[];
    })[],
  ): WarehouseEntity[] {
    return prismaData.map(this.toDomain);
  }
}
