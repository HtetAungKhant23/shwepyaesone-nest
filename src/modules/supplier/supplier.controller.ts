import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
}
