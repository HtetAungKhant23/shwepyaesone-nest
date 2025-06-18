import { BadRequestException, Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { IPagination, Pagination } from '@app/core/decorators/pagination.decorator';
import { IResponsePaging } from '@app/core/interfaces/response.interface';
import { MealService } from './meal.service';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { GetMealsDto } from './dto/get-meals.dto';

@Controller()
@ApiTags('Resources')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class MealController {
  constructor(private mealService: MealService) {}

  @Get('categories')
  async getCategories() {
    try {
      const categories = await this.mealService.getCategories();
      return {
        _data: categories,
        _metadata: {
          message: 'Categories successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to get categories',
      });
    }
  }

  @Get('meals')
  async getMeals(@Query() dto: GetMealsDto, @Pagination() { limit, offset }: IPagination): Promise<IResponsePaging> {
    try {
      const { meals, total } = await this.mealService.getMeals({ ...dto, limit, offset });
      return {
        _data: meals,
        _pagination: {
          total,
          totalPage: Math.ceil(total / dto.size),
        },
        _metadata: {
          message: 'Meals successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to get meals',
      });
    }
  }

  @Get('meals/:id')
  @ApiParam({ type: String, name: 'id' })
  async getMealDetail(@Param('id') id: string) {
    try {
      const mealDetail = await this.mealService.getMealDetail(id);
      return {
        _data: mealDetail,
        _metadata: {
          message: 'Meal detail successfully fetched.',
          statusCode: HttpStatus.OK,
        },
      };
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        cause: new Error(err),
        code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        description: 'Failed to get meal detail',
      });
    }
  }
}
