import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { AddRiceDto } from './dto/add-rice.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly dbService: PrismaService) {}

  async createInventory(dto: CreateInventoryDto) {
    try {
      return await this.dbService.inventory.create({
        data: {
          name: dto.name,
        },
      });
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async addRice(dto: AddRiceDto & { id: string }) {
    try {
      const riceAddedToInventory = await this.dbService.riceBySupplier.create({
        data: {
          inventoryId: dto.id,
          riceId: dto.riceId,
          supplierId: dto.supplierId,
          buyingPrice: dto.buyingPrice,
          sellingPrice: dto.sellingPrice,
          totalStock: dto.stock,
          remainStock: dto.stock,
        },
      });
      await this.dbService.inventory.update({
        where: {
          id: dto.id,
        },
        data: {
          totalStock: {
            increment: dto.stock,
          },
        },
      });
      return riceAddedToInventory;
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }
}
