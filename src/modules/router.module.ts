import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAuthModule } from './route/router.auth.module';
import { RoutesMealModule } from './route/router.meal.module';
import { RoutesPlanModule } from './route/router.plan.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(
      RoutesAuthModule,
      RoutesMealModule,
      RoutesPlanModule,
      NestJsRouterModule.register([
        {
          path: '/auth',
          module: RoutesAuthModule,
        },
      ]),
      NestJsRouterModule.register([
        {
          path: '/',
          module: RoutesMealModule,
        },
      ]),
      NestJsRouterModule.register([
        {
          path: '/plans',
          module: RoutesPlanModule,
        },
      ]),
    );
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
