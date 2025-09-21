import { Supplier } from '@prisma/client';
import { SupplierEntity } from '../entity/supplier.entity';

export class SupplierMapper {
  static toDomain(prismaData: Supplier): SupplierEntity {
    return new SupplierEntity(
      prismaData.id,
      prismaData.name,
      prismaData.phone,
      prismaData.createdAt,
      prismaData.updatedAt,
      prismaData.address,
    );
  }
}
