import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { RiceService } from './rice.service';
import { CreateRiceDto } from './dto/create-rice.dto';
import { UserAuthGuard } from '../auth/guard/user.auth.guard';

@ApiTags('Rice')
@Controller()
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
export class RiceController {
  constructor(private readonly riceService: RiceService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllRice() {
    const rice = await this.riceService.getAllRice();
    return {
      _data: rice,
      _metadata: {
        success: true,
        message: 'rice successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateRiceDto })
  async createRice(@Body() dto: CreateRiceDto) {
    const rice = await this.riceService.createRice(dto);
    return {
      _data: rice,
      _metadata: {
        success: true,
        message: 'rice successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: String, name: 'id' })
  async deleteRice(@Param('id') riceId: string) {
    await this.riceService.deleteRice(riceId);
    return {
      _data: {},
      _metadata: {
        success: true,
        message: 'rice successfully deleted.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
