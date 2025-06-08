import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { IResponse } from '@app/core/interfaces/response.interface';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { PlanService } from './plan.service';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { GetPlansDto } from './dto/get-plans.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller()
@ApiTags('Plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @ApiBody({ type: CreatePlanDto })
  async createPlan(@Body() dto: CreatePlanDto, @CurrentUser() user: IAuthUser) {
    try {
      await this.planService.createPlan({ ...dto, userId: user.id });
      return {
        _data: {},
        _metadata: {
          message: 'Plan successfully created.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to create plan',
      });
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async getPlans(@CurrentUser() user: IAuthUser, @Query() dto: GetPlansDto): Promise<IResponse> {
    try {
      const plans = await this.planService.getPlans({ ...dto, userId: user.id });
      return {
        _data: plans,
        _metadata: {
          message: 'Plans successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to get plans',
      });
    }
  }

  @Get('shopping')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async getShoppings(@CurrentUser() user: IAuthUser): Promise<IResponse> {
    try {
      const shoppings = await this.planService.getShopping(user.id);
      return {
        _data: shoppings,
        _metadata: {
          message: 'Shoppings successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to get shoppings',
      });
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @ApiBody({ type: UpdatePlanDto })
  async updatePlan(@Param('id') planId: string, @Body() dto: UpdatePlanDto) {
    try {
      await this.planService.updatePlan({ ...dto, planId });
      return {
        _data: {},
        _metadata: {
          message: 'Plan successfully updated.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to update plan',
      });
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @ApiBody({ type: UpdatePlanDto })
  async deletePlan(@Param('id') planId: string) {
    try {
      await this.planService.deletePlan(planId);
      return {
        _data: {},
        _metadata: {
          message: 'Plan successfully deleted.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to delete plan',
      });
    }
  }

  // @Patch('shopping')
  // @ApiBearerAuth()
  // @UseGuards(UserAuthGuard)
  // async updateShoppings(@CurrentUser() user: IAuthUser): Promise<IResponse> {
  //   try {
  //     const shoppings = await this.planService.getShopping(user.id);
  //     return {
  //       _data: shoppings,
  //       _metadata: {
  //         message: 'Shoppings successfully fetched.',
  //         statusCode: HttpStatus.OK,
  //       },
  //     };
  //   } catch (err) {
  //     throw new BadRequestException({
  //       message: err.message,
  //       cause: new Error(err),
  //       code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
  //       description: 'Failed to get shoppings',
  //     });
  //   }
  // }
}
