import { SwaggerConfig } from '@core/interfaces/swagger.interface';
import { registerAs } from '@nestjs/config';

/**
 * Configuration for the swagger UI (found at /api).
 * Change this to suit your app!
 */
export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'Spend Wise',
  description: 'Spend Wise is income/expend tracker and build by using Nest.js.',
  version: '1.0',
  tags: [],
};

export default registerAs(
  'swagger',
  (): Record<string, any> => ({
    username: process.env.SW_USERNAME || '',
    password: process.env.SW_PASSWORD || '',
  }),
);
