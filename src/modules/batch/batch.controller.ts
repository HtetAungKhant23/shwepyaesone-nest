import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { StoreToWarehouseDto } from './dto/store-to-warehouse.dto';

@ApiTags('Batch')
@Controller()
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: String, name: 'id' })
  async getBatchDetail(@Param('id') id: string) {
    const batch = await this.batchService.getBatchDetail(id);
    return {
      _data: batch,
      _metadata: {
        success: true,
        message: 'batch detail successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateBatchDto })
  async createBatch(@Body() dto: CreateBatchDto, @CurrentUser() admin: IAuthUser) {
    const batch = await this.batchService.createBatch({ ...dto, adminId: admin.id });
    return {
      _data: batch,
      _metadata: {
        success: true,
        message: 'batch successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Post(':id/store-to-warehouse')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: StoreToWarehouseDto })
  async storeToWarehouse(@Body() dto: StoreToWarehouseDto, @Param('id') id: string, @CurrentUser() admin: IAuthUser) {
    await this.batchService.storeToWarehouse({ ...dto, batchId: id, adminId: admin.id });
    return {
      _data: {},
      _metadata: {
        success: true,
        message: 'stock successfully stored in warehouse.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
