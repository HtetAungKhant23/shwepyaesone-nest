import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { IResponse } from '@app/core/interfaces/response.interface';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { PlanService } from './plan.service';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { GetPlansDto } from './dto/get-plans.dto';
import { CreatePlanDto } from './dto/create-plan.dto';

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
