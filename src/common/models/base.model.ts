import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { RegisteredStatus } from '../generalCustomResponses/signup-checkout.response';
registerEnumType(RegisteredStatus, { name: 'RegisteredStatus' });

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @Field(() => ID)
  id: number;

  @Field(() => Date, { nullable: false, description: 'Identifies the date and time when the object was created.' })
  createdAt: Date;

  @Field(() => Date, { nullable: true, description: 'Identifies the date and time when the object was last updated.' })
  updatedAt: Date;
}
