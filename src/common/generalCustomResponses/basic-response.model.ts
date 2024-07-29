import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BasicResponse {
  @Field(() => String, { nullable: false })
  status: string;

  @Field(() => Int, { nullable: true })
  id: number;
}
