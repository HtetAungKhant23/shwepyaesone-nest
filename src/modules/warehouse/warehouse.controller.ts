import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { TransferStockDto } from './dto/transfer-stock.dto';

@ApiTags('Warehouse')
@Controller()
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getWarehouses() {
    const warehouses = await this.warehouseService.getWarehouses();
    return {
      _data: warehouses,
      _metadata: {
        success: true,
        message: 'warehouses successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateWarehouseDto })
  async createWarehouse(@Body() dto: CreateWarehouseDto, @CurrentUser() admin: IAuthUser) {
    const warehouse = await this.warehouseService.createWarehouse({ ...dto, adminId: admin.id });
    return {
      _data: warehouse,
      _metadata: {
        success: true,
        message: 'warehouse successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: String, name: 'id' })
  async getWarehouseDetail(@Param('id') id: string) {
    const warehouse = await this.warehouseService.getWarehouseDetail(id);
    return {
      _data: warehouse,
      _metadata: {
        success: true,
        message: 'warehouse detail successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post(':id/transfer-stock')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: TransferStockDto })
  async transferStock(@Body() dto: TransferStockDto, @Param('id') id: string, @CurrentUser() admin: IAuthUser) {
    await this.warehouseService.transferStock({ ...dto, fromId: id, adminId: admin.id });
    return {
      _data: {},
      _metadata: {
        success: true,
        message: 'stock successfully transfer.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
