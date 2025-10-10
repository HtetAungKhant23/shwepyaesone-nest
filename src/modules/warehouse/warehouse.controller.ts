import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { AddRiceDto } from './dto/add-rice.dto';

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
        message: 'inventory successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateWarehouseDto })
  async createWarehouse(@Body() dto: CreateWarehouseDto) {
    const warehouse = await this.warehouseService.createWarehouse(dto);
    return {
      _data: warehouse,
      _metadata: {
        success: true,
        message: 'warehouse successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Post(':id/add-rice')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddRiceDto })
  async addRice(@Body() dto: AddRiceDto, @Param('id') id: string) {
    const riceAddedToWarehouse = await this.warehouseService.addRice({ ...dto, id });
    return {
      _data: riceAddedToWarehouse,
      _metadata: {
        success: true,
        message: 'new rice successfully added to warehouse.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
