import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PasswordService } from '../auth/password.service';

@Module({
  providers: [UsersResolver, UsersService, PasswordService],
  exports: [PasswordService, UsersService],
})
export class UsersModule {}
