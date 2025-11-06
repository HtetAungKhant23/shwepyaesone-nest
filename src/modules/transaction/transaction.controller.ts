import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@app/core/dto/pagination.dto';
import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { TransactionService } from './transaction.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';

@ApiTags('Transaction')
@Controller()
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('payment')
  @HttpCode(HttpStatus.OK)
  async getAllPayment(@Query() query: PaginationDto) {
    const payments = await this.transactionService.getAllPayment(query);
    return {
      _data: payments,
      _metadata: {
        success: true,
        message: 'payment list successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Get('payment/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: String, name: 'id' })
  async getPaymentDetail(@Param('id') id: string) {
    const payment = await this.transactionService.getPaymentDetail(id);
    return {
      _data: payment,
      _metadata: {
        success: true,
        message: 'payment detail successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('payment')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreatePaymentDto })
  async createPayment(@Body() dto: CreatePaymentDto, @CurrentUser() admin: IAuthUser) {
    const payment = await this.transactionService.createPayment({ ...dto, adminId: admin.id });
    return {
      _data: payment,
      _metadata: {
        success: true,
        message: 'payment successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }
}
