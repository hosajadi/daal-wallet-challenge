import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SetPasswordDto {
  @Field(() => String, { nullable: false })
  @MinLength(11)
  @MaxLength(11)
  @IsNotEmpty()
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(6)
  password?: string;
}

@InputType()
export class ChangePasswordDto {
  @Field(() => String, { nullable: false })
  @MinLength(11)
  @MaxLength(11)
  @IsNotEmpty()
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(6)
  oldPassword?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(6)
  newPassword?: string;
}
