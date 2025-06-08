import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetPlansDto } from './dto/get-plans.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateManualPlanDto } from './dto/create-manual-plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly dbService: PrismaService) {}

  async createPlan(dto: CreatePlanDto & { userId: string }) {
    const plainIngredients = dto.ingredients.map((item) => ({
      name: item.name,
      qty: item.qty,
    }));

    const existPlan = await this.dbService.plan.findFirst({
      where: {
        recipeName: dto.recipeName,
        recipeImage: dto.recipeImgUrl,
        deleted: false,
        done: false,
        categoryName: dto.categoryName,
        instruction: dto.instruction,
        ingredients: {
          equals: plainIngredients,
        },
      },
    });

    if (existPlan) {
      throw new Error('plan already exist');
    }

    const shoppingIngredients = dto.ingredients.map((item) => ({
      name: item.name,
      qty: item.qty,
      recipeName: dto.recipeName,
      bought: false,
    }));
    const shopping = await this.dbService.shopping.create({
      data: {
        ingredients: shoppingIngredients,
      },
    });
    return this.dbService.plan.create({
      data: {
        userId: dto.userId,
        shoppingId: shopping.id,
        recipeName: dto.recipeName,
        recipeImage: dto.recipeImgUrl,
        categoryName: dto.categoryName,
        instruction: dto.instruction,
        ingredients: plainIngredients,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  }

  async createManualPlan(dto: CreateManualPlanDto & { userId: string; recipeImageUrl: any }) {
    const ingredients = JSON.parse(dto.ingredients);

    console.log({ ingredients });

    const plainIngredients = ingredients.map((item: { name: string; qty: string }) => ({
      name: item.name,
      qty: item.qty,
    }));

    const existPlan = await this.dbService.plan.findFirst({
      where: {
        recipeName: dto.recipeName,
        recipeImage: dto.recipeImageUrl,
        deleted: false,
        done: false,
        instruction: dto.instruction,
        ingredients: {
          equals: plainIngredients,
        },
      },
    });

    if (existPlan) {
      throw new Error('plan already exist');
    }

    const shoppingIngredients = ingredients.map((item: { name: string; qty: string }) => ({
      name: item.name,
      qty: item.qty,
      recipeName: dto.recipeName,
      bought: false,
    }));
    const shopping = await this.dbService.shopping.create({
      data: {
        ingredients: shoppingIngredients,
      },
    });
    return this.dbService.plan.create({
      data: {
        userId: dto.userId,
        shoppingId: shopping.id,
        recipeName: dto.recipeName,
        recipeImage: dto.recipeImageUrl,
        instruction: dto.instruction,
        ingredients: plainIngredients,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  }

  async getPlans(dto: GetPlansDto & { userId: string }) {
    return this.dbService.plan.findMany({
      where: {
        userId: dto.userId,
        deleted: false,
      },
    });
  }

  async getShopping(userId: string) {
    return this.dbService.shopping.findMany({
      where: {
        plan: {
          userId,
          deleted: false,
        },
      },
    });
  }

  async updatePlan(dto: UpdatePlanDto & { planId: string }) {
    const plainIngredients = dto.ingredients.map((item) => ({
      name: item.name,
      qty: item.qty,
    }));

    const updPlan = await this.dbService.plan.update({
      where: {
        id: dto.planId,
      },
      data: {
        ingredients: plainIngredients,
      },
    });

    const shoppingIngredients = dto.ingredients.map((item) => ({
      name: item.name,
      qty: item.qty,
      recipeName: updPlan.recipeName,
      bought: false,
    }));

    await this.dbService.shopping.update({
      where: {
        id: updPlan.shoppingId || '',
      },
      data: {
        ingredients: shoppingIngredients,
      },
    });

    return updPlan;
  }

  async deletePlan(planId: string) {
    return this.dbService.plan.update({
      where: {
        id: planId,
      },
      data: {
        deleted: true,
      },
    });
  }

  // async makeIngredientsBought(dto: MakeIngredientsBoughtDto) {
  //   await Promise.all(
  //     dto.ingredients.map(async (item) => {
  //       const shopping = await this.dbService.shopping.findUnique({
  //         where: {
  //           id: item.id,
  //         },
  //       });

  //       if (shopping?.ingredients) {
  //         if (Array.isArray(shopping.ingredients))
  //         {
  //         }
  //       }

  //       const ingre = shopping?.ingredients?.valueOf();
  //       const tt = JSON.parse(ingre as string);
  //       console.log(tt[0]);

  //       // const ingredients = JSON.parse(shopping?.ingredients?.toString() || '');
  //       // console.log({ ingredients });

  //       // ingredients.map(async (data: { name: string; qty: string; recipeName: string; bought: boolean }) => {
  //       //   if (data.name === item.name && data.qty === item.qty) {
  //       //     data.bought = item.bought;
  //       //     await this.dbService.shopping.update({
  //       //       where: {
  //       //         id: item.id,
  //       //       },
  //       //       data: {},
  //       //     });
  //       //   }
  //       // });
  //       // console.log({ ingredients });
  //     }),
  //   );
  //   return 'success';
  // }
}
