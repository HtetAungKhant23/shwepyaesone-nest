import { Controller, Get, HttpStatus } from '@nestjs/common';
import { IResponse } from './core/interfaces/response.interface';

@Controller()
export class AppController {
  @Get('/health-check')
  healthCheck(): IResponse {
    return {
      _data: new Date(),
      _metadata: {
        success: true,
        message: 'Health check success.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
