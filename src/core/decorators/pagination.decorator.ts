import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IPagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const page = parseInt(req.query.page as string, 10) || 1;
  const size = parseInt(req.query.size as string, 10) || 10;

  if (Number.isNaN(page) || page < 0 || Number.isNaN(size) || size < 0) {
    throw new BadRequestException('Invalid pagination params');
  }
  if (size > 100) {
    throw new BadRequestException('Invalid pagination params: Max size is 100');
  }

  const limit = size;
  const offset = (page - 1) * limit;

  return { page, limit, size, offset };
});
