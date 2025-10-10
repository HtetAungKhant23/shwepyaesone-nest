import { Module } from '@nestjs/common';
import { WarehouseController } from '../warehouse/warehouse.controller';
import { WarehouseService } from '../warehouse/warehouse.service';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class RoutesWarehouseModule {}
