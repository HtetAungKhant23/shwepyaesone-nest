import { Module } from '@nestjs/common';
import { SupplierController } from '../supplier/supplier.controller';
import { SupplierService } from '../supplier/supplier.service';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class RoutesSupplierModule {}
