import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { PaymentTransactionType } from '@prisma/client';
registerEnumType(PaymentTransactionType, { name: 'PaymentTransactionType' });

@ObjectType()
export abstract class PaymentTransaction extends BaseModel {
  @Field(() => Int, { nullable: false })
  userId: number;
  @Field(() => Int, { nullable: false })
  amount: number;
  @Field(() => String, { nullable: false })
  referenceId: string;
  @Field(() => PaymentTransactionType, { nullable: false })
  paymentTransactionType: PaymentTransactionType;
}
