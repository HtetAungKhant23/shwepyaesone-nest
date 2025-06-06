import { Module } from '@nestjs/common';
import { PlanService } from '../plan/plan.service';
import { PlanController } from '../plan/plan.controller';

@Module({
  controllers: [PlanController],
  providers: [PlanService],
})
export class RoutesPlanModule {}
