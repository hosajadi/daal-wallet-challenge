import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { PaymentCronService } from './payment-cron.service';

describe('PaymentCronService', () => {
  let service: PaymentCronService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentCronService,
        {
          provide: PrismaService,
          useValue: {
            paymentTransaction: {
              aggregate: jest.fn(),
            },
            dailyTotal: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PaymentCronService>(PaymentCronService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate daily payments and create a daily total record', async () => {
    const now = new Date();
    const today1AM = new Date();
    today1AM.setHours(1, 0, 0, 0);

    const yesterday1AM = new Date();
    yesterday1AM.setDate(now.getDate() - 1);
    yesterday1AM.setHours(1, 0, 0, 0);

    const sumResult = { _sum: { amount: 1000 } };
    (prismaService.paymentTransaction.aggregate as jest.Mock).mockResolvedValue(sumResult);
    (prismaService.dailyTotal.create as jest.Mock).mockResolvedValue({
      id: 1,
      date: today1AM,
      total: sumResult._sum.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.dailyPaymentCalculations();

    expect(prismaService.paymentTransaction.aggregate).toHaveBeenCalledWith({
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

    expect(prismaService.dailyTotal.create).toHaveBeenCalledWith({
      data: {
        total: sumResult._sum.amount,
        date: today1AM,
      },
    });

    expect(result).toEqual({
      id: 1,
      date: today1AM,
      total: sumResult._sum.amount,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
  it('should call handleCron method every day at 1 AM', async () => {
    const sumResult = { _sum: { amount: 1000 } };
    (prismaService.paymentTransaction.aggregate as jest.Mock).mockResolvedValue(sumResult);
    (prismaService.dailyTotal.create as jest.Mock).mockResolvedValue({
      id: 1,
      date: new Date(),
      total: sumResult._sum.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    jest.useFakeTimers();
    const millisecondsUntil1AM = 1 * 60 * 60 * 1000;

    // Move the timer to simulate the cron job execution at 1 AM
    jest.advanceTimersByTime(millisecondsUntil1AM);
    const result = await service.dailyPaymentCalculations();

    expect(result).toEqual({
      id: 1,
      date: expect.any(Date),
      total: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
