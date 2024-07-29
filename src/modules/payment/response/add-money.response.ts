import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddMoneyResponse {
  @Field(() => String)
  referenceId: string;
}
