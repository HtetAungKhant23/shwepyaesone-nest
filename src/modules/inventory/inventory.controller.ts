import { Body, Controller, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
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

  @Post('')
  @ApiBody({ type: CreateInventoryDto })
  async createInventory(@Body() dto: CreateInventoryDto) {
    const inventory = await this.inventoryService.createInventory(dto);
    return {
      _data: inventory,
      _metadata: {
        message: 'inventory successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Post(':id/add-rice')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddRiceDto })
  async addRice(@Body() dto: AddRiceDto, @Param('id') id: string) {
    const riceAddedToInventory = await this.inventoryService.addRice({ ...dto, id });
    return {
      _data: riceAddedToInventory,
      _metadata: {
        message: 'new rice successfully added to inventory.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }
}
