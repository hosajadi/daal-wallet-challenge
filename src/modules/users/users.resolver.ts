import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../../common/decorators/user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UsersService } from './users.service';
import { User } from '../../common/models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { BasicResponse } from '../../common/generalCustomResponses/basic-response.model';
import { SetPasswordDto } from '../auth/dto/password.input.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(@UserEntity() user: User, @Args('data') newUserData: UpdateUserInput) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @Mutation(() => BasicResponse)
  @UseGuards(new GqlAuthGuard())
  async setPassword(
    @UserEntity() user: User,
    @Args('setPasswordInput') setPasswordDto: SetPasswordDto,
  ): Promise<BasicResponse> {
    await this.usersService.setPassword(user.id, setPasswordDto);
    const resp = new BasicResponse();
    resp.status = 'OK';
    resp.id = 200;
    return resp;
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(@UserEntity() user: User, @Args('data') changePassword: ChangePasswordInput) {
    return this.usersService.changePassword(user.id, user.password, changePassword);
  }
}
