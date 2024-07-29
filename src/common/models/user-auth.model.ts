import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Token } from './token.model';

@ObjectType()
export class UserAuth extends Token {
  @Field(() => User)
  user: User;
}
