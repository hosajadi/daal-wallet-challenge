import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserEntity } from '../../common/decorators/user.decorator';
import { User } from '../../common/models/user.model';
import { GetBalanceResponse } from './response/get-balance.response';
import { AddMoneyResponse } from './response/add-money.response';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Query(() => GetBalanceResponse)
  @UseGuards(GqlAuthGuard)
  async getBalance(@UserEntity() user: User): Promise<GetBalanceResponse> {
    const balance = await this.paymentService.getBalance(user.id);
    return {
      balance: balance,
    };
  }

  @Mutation(() => AddMoneyResponse)
  @UseGuards(GqlAuthGuard)
  async addMoney(
    @UserEntity() user: User,
    @Args('amount', { type: () => Int, nullable: false }) amount: number,
  ): Promise<AddMoneyResponse> {
    const referenceId = await this.paymentService.addMoney(user.id, amount);
    return {
      referenceId: referenceId,
    };
  }
}
