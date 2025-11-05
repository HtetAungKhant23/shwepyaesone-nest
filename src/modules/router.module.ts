import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAuthModule } from './route/router.auth.module';
import { RoutesRiceModule } from './route/router.rice.module';
import { RoutesWarehouseModule } from './route/router.warehouse.module';
import { RoutesSupplierModule } from './route/router.supplier.module';
import { RoutesBatchModule } from './route/route.batch.module';
import { RoutesTransactionModule } from './route/route.transaction.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(
      RoutesAuthModule,
      RoutesRiceModule,
      RoutesWarehouseModule,
      RoutesSupplierModule,
      RoutesBatchModule,
      RoutesTransactionModule,
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
          path: '/warehouse',
          module: RoutesWarehouseModule,
        },
        {
          path: '/supplier',
          module: RoutesSupplierModule,
        },
        {
          path: '/batch',
          module: RoutesBatchModule,
        },
        {
          path: '/transaction',
          module: RoutesTransactionModule,
        },
      ]),
    );
    return {
      module: RouterModule,
      imports,
    };
  }
}
