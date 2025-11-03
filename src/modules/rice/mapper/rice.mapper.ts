import { Rice } from '@prisma/client';
import { RiceEntity } from '../entity/rice.entity';

export class RiceMapper {
  static toDomain(prismaData: Rice): RiceEntity {
    return new RiceEntity(prismaData.id, prismaData.name, prismaData.createdAt);
  }

  static toDomainArray(prismaData: Rice[]): RiceEntity[] {
    return prismaData.map(this.toDomain);
  }

  // static riceBySupplierToDomain(
  //   prismaData: RiceBySupplier & {
  //     rice: Rice;
  //     supplier: Supplier;
  //   },
  // ): RiceBySupplierEntity {
  //   const entity = new RiceBySupplierEntity();
  //   entity.id = prismaData.id;
  //   entity.buyingPrice = prismaData.buyingPrice;
  //   entity.sellingPrice = prismaData.sellingPrice;
  //   entity.totalStock = prismaData.totalStock;
  //   entity.remainStock = prismaData.remainStock;
  //   entity.rice = this.toDomain(prismaData.rice);
  //   entity.supplier = SupplierMapper.toDomain(prismaData.supplier);
  //   entity.createdAt = prismaData.createdAt;
  //   entity.updatedAt = prismaData.updatedAt;
  //   return entity;
  // }

  // static riceBySupplierToDomainArray(
  //   prismaData: (RiceBySupplier & {
  //     rice: Rice;
  //     supplier: Supplier;
  //   })[],
  // ): RiceBySupplierEntity[] {
  //   return prismaData.map(this.riceBySupplierToDomain.bind(this));
  // }
}
