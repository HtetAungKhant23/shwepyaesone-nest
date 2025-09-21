import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
  async getAllRice() {
    const rice = await this.riceService.getAllRice();
    return {
      _data: rice,
      _metadata: {
        message: 'rice successfully fetched.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Post('')
  @ApiBody({ type: CreateRiceDto })
  async createRice(@Body() dto: CreateRiceDto) {
    const rice = await this.riceService.createRice(dto);
    return {
      _data: rice,
      _metadata: {
        message: 'rice successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }

  @Post('category')
  @ApiBody({ type: CreateRiceCategoryDto })
  async createRiceCategory(@Body() dto: CreateRiceCategoryDto) {
    const riceCate = await this.riceService.createRiceCategory(dto);
    return {
      _data: riceCate,
      _metadata: {
        message: 'rice category successfully created.',
        statusCode: HttpStatus.CREATED,
      },
    };
  }
}
