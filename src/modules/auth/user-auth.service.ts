import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { UserSignupInputDto } from './dto/user-signup.input.dto';
import { Token } from '../../common/models/token.model';
import { NestConfig, SecurityConfig } from '../../common/configs/config.interface';
import { errorTypes } from '../../common/errors';
import { RegisteredStatus, SignupCheckoutResponse } from '../../common/generalCustomResponses/signup-checkout.response';
import { RedisCacheService } from '../cache/redis-cache.service';
import { JwtInput } from './dto/jwt.dto';
import { SmsService } from '../../common/commonServices/sms.service';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
    private readonly smsService: SmsService,
  ) {}
  async createUserInCache(payload: UserSignupInputDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber: payload.phoneNumber,
      },
    });

    if (user) {
      throw errorTypes.users.USER_ALREADY_REGISTERED();
    }

    let randomNumber: string;
    if (
      (this.configService.get<NestConfig>('nest').env === 'localhost' ||
        this.configService.get<NestConfig>('nest').env === 'stage') &&
      payload.phoneNumber.slice(0, 7) === '0900000'
    ) {
      randomNumber = '11111';
    } else {
      randomNumber = this.passwordService.generateRandomCode(5);
    }

    if (payload.password) {
      const hashedPassword = await this.passwordService.hashPassword(payload.password);
      await this.redisCacheService.saveJsonToCache(
        'signupCacheUser' + payload.phoneNumber,
        {
          ...payload,
          password: hashedPassword,
          code: randomNumber,
        },
        50000,
      );
    } else {
      await this.redisCacheService.saveJsonToCache(
        'signupCacheUser' + payload.phoneNumber,
        {
          ...payload,
          code: randomNumber,
        },
        50000,
      );
    }
    return randomNumber;
  }
  public async setCodeToCache(key: string, value: string) {
    await this.redisCacheService.set(key, value);
  }
  async findUserByPhoneNumberAndRole(phoneNumber: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!user) {
      throw errorTypes.users.USER_NOT_FOUND(null, phoneNumber);
    }

    return user;
  }
  async signupWithCode(phoneNumber: string, code: string): Promise<Token> {
    const cacheUser = await this.redisCacheService.getJsonFromCache<UserSignupInputDto & { code: string }>(
      'signupCacheUser' + phoneNumber,
    );
    if (!cacheUser) {
      throw errorTypes.users.USER_SUBMIT_CODE_TIME_OUT();
    }
    if (code !== cacheUser.code.toString()) {
      throw errorTypes.users.USER_SUBMIT_INVALID_CODE();
    }
    if (code === cacheUser.code.toString()) {
      await this.redisCacheService.delete(phoneNumber);
      const createdUser = await this.prismaService.user.create({
        data: {
          firstname: cacheUser.firstname,
          lastname: cacheUser.lastname,
          email: cacheUser.email,
          phoneNumber: cacheUser.phoneNumber,
          password: cacheUser.password,
        },
      });
      return this.generateTokens({
        userId: createdUser.id,
      });
    }
  }
  async loginWithPassword(phoneNumber: string, password: string): Promise<Token> {
    const user = await this.findUserByPhoneNumberAndRole(phoneNumber);
    if (!user.password) {
      throw errorTypes.users.USER_DOES_NOT_SET_PASSWORD();
    }

    const passwordValid = await this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw errorTypes.users.USER_INVALID_PASSWORD();
    }

    return this.generateTokens({
      userId: user.id,
    });
  }
  async loginCheckoutWithCode(phoneNumber: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!user) {
      throw errorTypes.users.USER_NOT_FOUND();
    }
    let randomNumber: string;
    if (
      (this.configService.get<NestConfig>('nest').env === 'localhost' ||
        this.configService.get<NestConfig>('nest').env === 'stage') &&
      phoneNumber.slice(0, 7) === '0900000'
    ) {
      randomNumber = '11111';
    } else {
      randomNumber = this.passwordService.generateRandomCode(5);
    }
    await this.setCodeToCache(phoneNumber, randomNumber);
    this.smsService.sendRegisterAuthCodeSMS(phoneNumber, randomNumber);
  }
  async loginWithCode(phoneNumber: string, code: string): Promise<Token> {
    const user = await this.findUserByPhoneNumberAndRole(phoneNumber);
    const codeFromRedis = await this.redisCacheService.get(phoneNumber);

    if (!codeFromRedis) {
      throw errorTypes.users.USER_SUBMIT_CODE_TIME_OUT();
    }

    if (code !== codeFromRedis) {
      throw errorTypes.users.USER_SUBMIT_INVALID_CODE();
    }
    await this.redisCacheService.delete(phoneNumber);
    return this.generateTokens({
      userId: user.id,
    });
  }
  async checkUserExistence(phoneNumber: string): Promise<SignupCheckoutResponse> {
    const signupCheckoutResponse = new SignupCheckoutResponse();
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!user) {
      signupCheckoutResponse.registeredStatus = RegisteredStatus.notRegistered;
      return signupCheckoutResponse;
    }

    if (user.password) {
      signupCheckoutResponse.registeredStatus = RegisteredStatus.registeredWithBoth;
    } else {
      signupCheckoutResponse.registeredStatus = RegisteredStatus.registeredWithCode;
    }
    return signupCheckoutResponse;
  }

  validateUser(userId: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id: userId } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prismaService.user.findUnique({ where: { id } });
  }

  generateTokens(payload: JwtInput): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: JwtInput): string {
    return this.jwtService.sign(payload);
  }
  private generateRefreshToken(payload: JwtInput): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }
  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw errorTypes.users.USER_NOT_FOUND();
    }
  }
}
