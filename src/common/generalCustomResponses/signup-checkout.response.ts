import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupCheckoutResponse {
  @Field(() => RegisteredStatus, { nullable: false })
  registeredStatus: RegisteredStatus;
}

export enum RegisteredStatus {
  notRegistered = 'notRegistered',
  registeredWithCode = 'registeredWithCode',
  registeredWithBoth = 'registeredWithBoth',
}
