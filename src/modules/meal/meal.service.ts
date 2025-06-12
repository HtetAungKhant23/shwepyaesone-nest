import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetMealsDto } from './dto/get-meals.dto';

@Injectable()
export class MealService {
  constructor(private readonly dbService: PrismaService) {}

  async getCategories() {
    return this.dbService.category.findMany({
      where: {
        name: {
          notIn: ['Starter', 'Side'],
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
      },
    });
  }

  async getMeals(dto: GetMealsDto & { limit: number; offset: number }) {
    const total = await this.dbService.meal.count({
      where: {
        ...(dto?.search && {
          name: {
            contains: dto.search,
            mode: 'insensitive',
          },
        }),
        ...(dto?.categoryId && {
          categoryId: dto.categoryId,
        }),
      },
    });
    const meals = await this.dbService.meal.findMany({
      where: {
        ...(dto?.search && {
          name: {
            contains: dto.search,
            mode: 'insensitive',
          },
        }),
        ...(dto?.categoryId && {
          categoryId: dto.categoryId,
        }),
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        mealIngredient: {
          select: {
            ingredient: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
            measurement: {
              select: {
                unit: true,
              },
            },
          },
        },
      },
      take: dto.limit,
      skip: dto.offset,
    });
    return { meals, total };
  }

  async getMealDetail(id: string) {
    return this.dbService.meal.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        mealIngredient: {
          select: {
            ingredient: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
            measurement: {
              select: {
                unit: true,
              },
            },
          },
        },
      },
    });
  }
}
