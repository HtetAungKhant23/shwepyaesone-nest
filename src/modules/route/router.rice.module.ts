import { Module } from '@nestjs/common';
import { RiceController } from '../rice/rice.controller';
import { RiceService } from '../rice/rice.service';

@Module({
  controllers: [RiceController],
  providers: [RiceService],
})
export class RoutesRiceModule {}
