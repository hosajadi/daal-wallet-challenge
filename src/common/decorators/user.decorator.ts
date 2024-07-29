import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../models/user.model';
export const UserEntity = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const user = GqlExecutionContext.create(ctx).getContext().req.user;
  if (user) {
    return <User>user;
  }
  throw new UnauthorizedException();
});
