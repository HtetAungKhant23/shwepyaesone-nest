import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAuthModule } from './route/router.auth.module';
import { RoutesRiceModule } from './route/router.rice.module';
import { RoutesInventoryModule } from './route/router.inventory.module';
import { RoutesSupplierModule } from './route/router.supplier.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(
      RoutesAuthModule,
      RoutesRiceModule,
      RoutesInventoryModule,
      RoutesSupplierModule,
      NestJsRouterModule.register([
        {
          path: '/auth',
          module: RoutesAuthModule,
        },
        {
          path: '/rice',
          module: RoutesRiceModule,
        },
        {
          path: '/inventory',
          module: RoutesInventoryModule,
        },
        {
          path: '/supplier',
          module: RoutesSupplierModule,
        },
      ]),
    );
    return {
      module: RouterModule,
      imports,
    };
  }
}
