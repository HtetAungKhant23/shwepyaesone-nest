import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
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

  @Post('')
  @ApiBody({ type: CreateSupplierDto })
  async createSupplier(@Body() dto: CreateSupplierDto): Promise<IResponse> {
    const supplier = await this.supplierService.createSupplier(dto);
    return {
      _data: supplier,
      _metadata: {
        message: 'supplier successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }
}
