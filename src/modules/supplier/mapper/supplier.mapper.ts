import { Admin, Batch, Supplier } from '@prisma/client';
import { BatchMapper } from '@app/modules/batch/mapper/batch.mapper';
import { PopulatedSupplierEntity, SupplierEntity } from '../entity/supplier.entity';

export class SupplierMapper {
  static toDomain(prismaData: Supplier): SupplierEntity {
    return new SupplierEntity(prismaData.id, prismaData.name, prismaData.phone, prismaData.createdAt, prismaData?.address || null);
  }

  static toDomainArray(prismaData: Supplier[]): SupplierEntity[] {
    return prismaData.map(this.toDomain);
  }

  static toDomainPopulated(
    prismaData: Supplier & {
      batch: (Batch & {
        items: {
          id: string;
        }[];
      } & { creator: Admin })[];
    },
  ): PopulatedSupplierEntity {
    return new PopulatedSupplierEntity(
      prismaData.id,
      prismaData.name,
      prismaData.phone,
      prismaData.createdAt,
      BatchMapper.toDomainArray(prismaData.batch),
      prismaData?.address || null,
    );
  }

  static toDomainPopulatedArray(
    prismaData: (Supplier & {
      batch: (Batch & {
        items: {
          id: string;
        }[];
      } & { creator: Admin })[];
    })[],
  ): PopulatedSupplierEntity[] {
    return prismaData.map(this.toDomainPopulated.bind(this));
  }
}
