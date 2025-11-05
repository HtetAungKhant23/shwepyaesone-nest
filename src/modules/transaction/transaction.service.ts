/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { PaginationDto } from '@app/core/dto/pagination.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly dbService: PrismaService) {}

  async getAllPayment(dto: PaginationDto) {
    try {
      const payments = await this.dbService.supplierPayment.findMany({
        include: {
          batch: true,
          item: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: +dto.size,
        skip: (+dto.page - 1) * +dto.size,
      });
      return payments;
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createPayment(dto: CreatePaymentDto & { adminId: string }) {
    try {
      const { batchId, items, serviceCharges, note, paid, adminId } = dto;

      const batch = await this.dbService.batch.findUnique({
        where: { id: batchId },
        include: { items: true },
      });

      if (!batch) {
        throw new Error('Batch not found');
      }
      if (batch.paid) {
        throw new Error('Already paid for this batch');
      }

      let totalItemPrice = 0;
      let totalQty = 0;

      for (const item of dto.items) {
        totalItemPrice += item.price * item.qty;
        totalQty += item.qty;
      }

      const parsedCharges = JSON.parse(serviceCharges);

      const totalServiceCharge = Number(Object.values(parsedCharges).reduce((sum: number, val: any) => sum + Number(val), 0)) * totalQty;

      const payment = await this.dbService.supplierPayment.create({
        data: {
          totalAmount: totalItemPrice - totalServiceCharge,
          note,
          serviceCharges: JSON.stringify(parsedCharges),
          paid,
          creatorId: adminId,
          batchId,
        },
      });

      await this.dbService.$transaction(async (tx) => {
        for (const item of items) {
          const batchItem = await tx.batchItem.findUnique({
            where: { id: item.batchItemId },
            select: { totalStock: true, paidQty: true },
          });

          if (!batchItem) {
            throw new Error(`Batch item not found: ${item.batchItemId}`);
          }

          const newPaidQty: number = batchItem.paidQty + item.qty;
          const fullyPaid: boolean = newPaidQty >= batchItem.totalStock;

          await tx.supplierPaymentItem.create({
            data: {
              price: item.price,
              qty: item.qty,
              supplierPaymentId: payment.id,
              batchItemId: item.batchItemId,
            },
          });

          await tx.batchItem.update({
            where: { id: item.batchItemId },
            data: {
              paidQty: newPaidQty,
              paid: fullyPaid,
            },
          });
        }
      });

      const totalPaidItems = await this.dbService.batchItem.count({
        where: { batchId, paid: true },
      });

      if (totalPaidItems === batch.items.length) {
        await this.dbService.batch.update({
          where: { id: batch.id },
          data: { paid: true },
        });
      }
    } catch (err) {
      console.error('Create Payment ERROR:', err);
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  // async createPayment(dto: CreatePaymentDto & { adminId: string }) {
  //   try {
  //     const batch = await this.dbService.batch.findUnique({
  //       where: {
  //         id: dto.batchId,
  //       },
  //       include: {
  //         items: true,
  //       },
  //     });
  //     if (!batch) {
  //       throw new Error('batch not found');
  //     }
  //     if (batch.paid) {
  //       throw new Error('already paid for this batch');
  //     }

  //     let totalItemPrice = 0;

  //     for (const item of dto.items) {
  //       totalItemPrice += item.price * item.qty;
  //     }

  //     const serviceCharges = JSON.parse(dto.serviceCharges);
  //     const totalServiceCharge = Number(Object.values(serviceCharges).reduce((sum: number, value: any) => sum + Number(value), 0));

  //     const payment = await this.dbService.supplierPayment.create({
  //       data: {
  //         totalAmount: totalItemPrice - totalServiceCharge,
  //         note: dto.note,
  //         serviceCharges: dto.serviceCharges,
  //         paid: dto.paid,
  //         creatorId: dto.adminId,
  //         batchId: dto.batchId,
  //       },
  //     });

  //     for (const item of dto.items) {
  //       await this.dbService.$transaction(async (tx) => {
  //         const batchItem = await tx.batchItem.findUnique({
  //           where: {
  //             id: item.batchItemId,
  //           },
  //         });
  //         const paidItem = batchItem?.totalStock === (batchItem?.paidQty || 0 + item.qty);
  //         await tx.supplierPaymentItem.create({
  //           data: {
  //             price: item.price,
  //             qty: item.qty,
  //             supplierPaymentId: payment.id,
  //             batchItemId: item.batchItemId,
  //           },
  //         });
  //         await tx.batchItem.update({
  //           where: {
  //             id: item.batchItemId,
  //           },
  //           data: {
  //             paidQty: {
  //               increment: item.qty,
  //             },
  //             paid: paidItem,
  //           },
  //         });
  //       });
  //     }

  //     const paidBatchItemCount = await this.dbService.batchItem.count({
  //       where: {
  //         batchId: dto.batchId,
  //         paid: true,
  //       },
  //     });

  //     if (paidBatchItemCount === batch.items.length) {
  //       await this.dbService.batch.update({
  //         where: {
  //           id: batch.id,
  //         },
  //         data: {
  //           paid: true,
  //         },
  //       });
  //     }
  //   } catch (err) {
  //     console.error('Create Payment ERROR: ', err);
  //     throw new BadRequestException({
  //       message: err.message,
  //       code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
  //     });
  //   }
  // }
}
