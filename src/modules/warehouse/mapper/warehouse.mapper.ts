import { Rice, Warehouse, WarehouseItem } from '@prisma/client';
import { RiceMapper } from '@app/modules/rice/mapper/rice.mapper';
import { PopulatedItemWarehouseEntity, WarehouseEntity, WarehouseItemEntity } from '../entity/warehouse.entity';

export class WarehouseMapper {
  static toDomain(
    prismaData: Warehouse & {
      items: {
        id: string;
      }[];
    },
  ): WarehouseEntity {
    return new WarehouseEntity(
      prismaData.id,
      prismaData.name,
      prismaData.address,
      prismaData.totalStock,
      prismaData.items.map((d) => d.id),
      prismaData.creatorId,
      prismaData.createdAt,
    );
  }

  static toDomainArray(
    prismaData: (Warehouse & {
      items: {
        id: string;
      }[];
    })[],
  ): WarehouseEntity[] {
    return prismaData.map(this.toDomain);
  }

  static toDomainPopulatedItemWarehouseEntity(
    prismaData: Warehouse & {
      items: (WarehouseItem & {
        rice: Rice;
      })[];
    },
  ): PopulatedItemWarehouseEntity {
    return new PopulatedItemWarehouseEntity(
      prismaData.id,
      prismaData.name,
      prismaData.address,
      prismaData.totalStock,
      this.toDomainItemEntityArray(prismaData.items),
      prismaData.creatorId,
      prismaData.createdAt,
    );
  }

  static toDomainItemEntity(
    prismaData: WarehouseItem & {
      rice: Rice;
    },
  ): WarehouseItemEntity {
    return new WarehouseItemEntity(
      prismaData.id,
      prismaData.stock,
      RiceMapper.toDomain(prismaData.rice),
      prismaData.createdAt,
      prismaData.updatedAt,
    );
  }

  static toDomainItemEntityArray(
    prismaData: (WarehouseItem & {
      rice: Rice;
    })[],
  ): WarehouseItemEntity[] {
    return prismaData.map(this.toDomainItemEntity.bind(this));
  }
}
