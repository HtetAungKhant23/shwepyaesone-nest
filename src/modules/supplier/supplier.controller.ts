import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { IResponse } from '@app/core/interfaces/response.interface';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@ApiTags('Supplier')
@Controller()
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllSupplier(): Promise<IResponse> {
    const suppliers = await this.supplierService.getAllSupplier();
    return {
      _data: suppliers,
      _metadata: {
        success: true,
        message: 'supplier successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSupplierDto })
  async createSupplier(@Body() dto: CreateSupplierDto): Promise<IResponse> {
    const supplier = await this.supplierService.createSupplier(dto);
    return {
      _data: supplier,
      _metadata: {
        success: true,
        message: 'supplier successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: String, name: 'id' })
  async deleteSupplier(@Param('id') supplierId: string) {
    await this.supplierService.deleteSupplier(supplierId);
    return {
      _data: {},
      _metadata: {
        success: true,
        message: 'supplier successfully deleted.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
