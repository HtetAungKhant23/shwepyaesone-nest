import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { AddRiceDto } from './dto/add-rice.dto';

@ApiTags('Inventory')
@Controller()
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getInventories() {
    const inventories = await this.inventoryService.getInventories();
    return {
      _data: inventories,
      _metadata: {
        success: true,
        message: 'inventory successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateInventoryDto })
  async createInventory(@Body() dto: CreateInventoryDto) {
    const inventory = await this.inventoryService.createInventory(dto);
    return {
      _data: inventory,
      _metadata: {
        success: true,
        message: 'inventory successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Post(':id/add-rice')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddRiceDto })
  async addRice(@Body() dto: AddRiceDto, @Param('id') id: string) {
    const riceAddedToInventory = await this.inventoryService.addRice({ ...dto, id });
    return {
      _data: riceAddedToInventory,
      _metadata: {
        success: true,
        message: 'new rice successfully added to inventory.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
