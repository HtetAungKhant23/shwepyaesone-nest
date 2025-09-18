import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';

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
}
