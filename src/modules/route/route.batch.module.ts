import { Module } from '@nestjs/common';
import { BatchController } from '../batch/batch.controller';
import { BatchService } from '../batch/batch.service';

@Module({
  controllers: [BatchController],
  providers: [BatchService],
})
export class RoutesBatchModule {}
