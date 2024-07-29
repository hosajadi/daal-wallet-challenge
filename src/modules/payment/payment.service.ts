import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PaymentTransactionType } from '@prisma/client';
import { errorTypes } from '../../common/errors';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}
  async getBalance(userId: number): Promise<number> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw errorTypes.users.USER_NOT_FOUND();
    }
    return user.balance;
  }

  async addMoney(userId: number, amount: number): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw errorTypes.users.USER_NOT_FOUND();
    }
    const transaction = await this.prismaService.paymentTransaction.create({
      data: {
        userId,
        amount,
        paymentTransactionType: amount > 0 ? PaymentTransactionType.CREDIT : PaymentTransactionType.DEBIT,
      },
    });

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    return transaction.referenceId;
  }
}
