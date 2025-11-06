/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/bad-request.exception';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity, PopulatedPaymentEntity } from './entity/payment.entity';
import { PaymentMapper } from './mapper/payment.mapper';
import { FilterTypeEnum, GetAllTransactionDto } from './dto/get-all-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly dbService: PrismaService) {}

  async getPaymentDetail(id: string): Promise<PopulatedPaymentEntity> {
    try {
      const payment = await this.dbService.supplierPayment.findUnique({
        where: {
          id,
        },
        include: {
          creator: true,
          batch: {
            include: {
              supplier: true,
            },
          },
          item: {
            include: {
              batchItem: {
                include: {
                  rice: true,
                },
              },
            },
          },
        },
      });
      if (!payment) {
        throw new Error('payment not found');
      }
      return PaymentMapper.toDomainPopulated(payment);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async getAllPayment(dto: GetAllTransactionDto): Promise<PaymentEntity[]> {
    try {
      const filter = dto.filter === FilterTypeEnum.all ? {} : dto.filter === FilterTypeEnum.paid ? { paid: true } : { paid: false };
      const payments = await this.dbService.supplierPayment.findMany({
        where: {
          ...filter,
        },
        include: {
          creator: true,
          batch: {
            include: { supplier: true },
          },
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
      return PaymentMapper.toDomainArray(payments);
    } catch (err) {
      throw new BadRequestException({
        message: err.message,
        code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      });
    }
  }

  async createPayment(dto: CreatePaymentDto & { adminId: string }) {
    try {
      const { batchId, items, serviceCharges, otherExpenses, note, paid, adminId } = dto;

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
      const totalServiceCharges = Number(Object.values(parsedCharges).reduce((sum: number, val: any) => sum + Number(val), 0)) * totalQty;

      let totalExpenses = 0;

      if (otherExpenses) {
        const parsedExpenses = JSON.parse(otherExpenses);
        totalExpenses = Number(Object.values(parsedExpenses).reduce((sum: number, val: any) => sum + Number(val), 0));
      }

      const totalAmount = totalItemPrice - (totalServiceCharges + totalExpenses);

      await this.dbService.$transaction(async (tx) => {
        const payment = await tx.supplierPayment.create({
          data: {
            totalAmount,
            note,
            serviceCharges: JSON.stringify(parsedCharges),
            ...(otherExpenses ? { otherExpenses } : {}),
            paid,
            creatorId: adminId,
            batchId,
          },
        });
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
}
