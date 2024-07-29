import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginWithPasswordInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  phoneNumber: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}

@InputType()
export class LoginWithCodeInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  phoneNumber: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  code: string;
}
