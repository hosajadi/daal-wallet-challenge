import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SetPasswordDto } from '../auth/dto/password.input.dto';
import { errorTypes } from '../../common/errors';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private passwordService: PasswordService,
  ) {}

  updateUser(userId: number, newUserData: UpdateUserInput) {
    return this.prismaService.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }
  async changePassword(userId: number, userPassword: string, changePassword: ChangePasswordInput) {
    const passwordValid = await this.passwordService.validatePassword(changePassword.oldPassword, userPassword);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(changePassword.newPassword);

    return this.prismaService.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
  public async setPassword(userId: number, setPasswordDto: SetPasswordDto) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw errorTypes.users.USER_NOT_FOUND();
    }
    if (user.phoneNumber !== setPasswordDto.phoneNumber) {
      throw errorTypes.users.USER_NOT_ALLOWED_TO_CHANGE_PASS();
    }
    if (user.password) {
      throw errorTypes.users.USER_ALREADY_SET_PASS();
    }
    const hashedPassword = await this.passwordService.hashPassword(setPasswordDto.password);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
  private async getUserById(userId: number): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
