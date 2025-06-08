import { Module } from '@nestjs/common';
import { CloudinaryService } from '@app/shared/upload/cloudinary.service';
import { PlanService } from '../plan/plan.service';
import { PlanController } from '../plan/plan.controller';

@Module({
  controllers: [PlanController],
  providers: [PlanService, CloudinaryService],
})
export class RoutesPlanModule {}
