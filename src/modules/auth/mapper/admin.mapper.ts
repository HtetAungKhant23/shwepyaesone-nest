import { Admin } from '@prisma/client';
import { AdminEntity } from '../entities/admin.entity';

export class AdminMapper {
  static toDomain(prismaData: Admin): AdminEntity {
    return new AdminEntity(prismaData.id, prismaData.name, prismaData.email, prismaData.isVerify, prismaData.deleted);
  }
}
