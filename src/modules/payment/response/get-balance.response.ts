import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetBalanceResponse {
  @Field(() => Int)
  balance: number;
}
