import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from 'nestjs-prisma';
import { PaymentTransactionType, User } from '@prisma/client';
import { PaymentTransaction } from '../../common/models/payment-transaction.model';
import { errorTypes } from '../../common/errors';

describe('WalletService', () => {
  let service: PaymentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, PrismaService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return the balance of a user', async () => {
      const userId = 1;
      const userBalance = 1000;
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({ id: userId, balance: userBalance } as User);

      const result = await service.getBalance(userId);

      expect(result).toEqual(userBalance);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.getBalance(userId)).rejects.toThrow(errorTypes.users.USER_NOT_FOUND());
    });
  });

  describe('addMoney', () => {
    it('should add money to the user balance and log the transaction', async () => {
      const userId = 1;
      const userFirstName = 'firstNameTest';
      const userLastName = 'lastNameTest';
      const userEmail = 'test@test.com';
      const userPhoneNumber = '0900000000';
      const userHashPassword = 'testHashPassword';
      const initialBalance = 1000;
      const amount = 500;
      const newBalance = initialBalance + amount;

      const user: User = {
        id: userId,
        firstname: userFirstName,
        lastname: userLastName,
        phoneNumber: userPhoneNumber,
        email: userEmail,
        balance: initialBalance,
        password: userHashPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const transaction: PaymentTransaction = {
        id: 1,
        userId: userId,
        amount: amount,
        referenceId: '123-abc',
        paymentTransactionType: amount > 0 ? PaymentTransactionType.CREDIT : PaymentTransactionType.DEBIT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(user);
      jest.spyOn(prisma.paymentTransaction, 'create').mockResolvedValueOnce(transaction);
      jest.spyOn(prisma.user, 'update').mockResolvedValueOnce({ ...user, balance: newBalance });

      const result = await service.addMoney(userId, amount);

      expect(result).toEqual(transaction.referenceId);
      expect(prisma.paymentTransaction.create).toHaveBeenCalledWith({
        data: {
          userId,
          amount,
          paymentTransactionType: amount > 0 ? PaymentTransactionType.CREDIT : PaymentTransactionType.DEBIT,
        },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    });
    it('should throw an error if user is not found', async () => {
      const userId = 1;
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.addMoney(userId, 1)).rejects.toThrow(errorTypes.users.USER_NOT_FOUND());
    });
  });
});
