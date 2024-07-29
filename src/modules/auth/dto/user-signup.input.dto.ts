import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserSignupInputDto {
  @Field(() => String, { nullable: false })
  @MinLength(11)
  @MaxLength(11)
  @IsNotEmpty()
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;
}
