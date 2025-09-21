import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { Inventory, Rice, RiceBySupplier, Supplier } from '@prisma/client';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { AddRiceDto } from './dto/add-rice.dto';
import { InventoryEntity } from './entity/inventory.entity';
import { InventoryMapper } from './mapper/inventory.mapper';

@Injectable()
export class InventoryService {
  constructor(private readonly dbService: PrismaService) {}

  async getInventories(): Promise<InventoryEntity[]> {
    try {
      const inventories: (Inventory & {
        riceBySupplier: (RiceBySupplier & {
          rice: Rice;
          supplier: Supplier;
        })[];
      })[] = await this.dbService.inventory.findMany({
        where: {
          deleted: false,
        },
        include: {
          riceBySupplier: {
            include: {
              rice: true,
              supplier: true,
            },
          },
        },
      });

      return InventoryMapper.toDomainArray(inventories);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

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
