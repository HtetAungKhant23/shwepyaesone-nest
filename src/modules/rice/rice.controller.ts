import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { RiceService } from './rice.service';
import { CreateRiceCategoryDto } from './dto/create-rice-category.dto';
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

  @Get('category')
  @HttpCode(HttpStatus.OK)
  async getAllRiceCategory() {
    const riceCate = await this.riceService.getAllRiceCategory();
    return {
      _data: riceCate,
      _metadata: {
        success: true,
        message: 'rice category successfully fetched.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('category')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateRiceCategoryDto })
  async createRiceCategory(@Body() dto: CreateRiceCategoryDto) {
    const riceCate = await this.riceService.createRiceCategory(dto);
    return {
      _data: riceCate,
      _metadata: {
        success: true,
        message: 'rice category successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Delete('category/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: String, name: 'id' })
  async deleteRiceCategory(@Param('id') categoryId: string) {
    await this.riceService.deleteRiceCategory(categoryId);
    return {
      _data: {},
      _metadata: {
        success: true,
        message: 'rice category successfully deleted.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
