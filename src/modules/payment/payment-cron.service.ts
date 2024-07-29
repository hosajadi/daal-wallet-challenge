import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PaymentCronService {
  constructor(private readonly prismaService: PrismaService) {}
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async dailyPaymentCalculations() {
    const now = new Date();
    const today1AM = new Date();
    today1AM.setHours(1, 0, 0, 0);
    const yesterday1AM = new Date();
    yesterday1AM.setDate(now.getDate() - 1);
    yesterday1AM.setHours(1, 0, 0, 0);
    const result = await this.prismaService.paymentTransaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: yesterday1AM,
          lt: today1AM,
        },
      },
    });
    return this.prismaService.dailyTotal.create({
      data: {
        total: result._sum.amount,
        date: today1AM,
      },
    });
  }
}
