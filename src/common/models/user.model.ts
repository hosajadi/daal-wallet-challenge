import { ObjectType, HideField, Field, Int } from "@nestjs/graphql";
import { IsEmail } from 'class-validator';
import { BaseModel } from './base.model';

@ObjectType()
export class User extends BaseModel {
  @Field(() => String, { nullable: true })
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => Int, { nullable: true })
  balance?: number;

  @HideField()
  password?: string;
}
