import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { UserAuthService } from './user-auth.service';
import { UserAuthResolver } from './user-auth.resolver';
import { JwtStrategy } from './jwt-strategy.service';
import { SecurityConfig } from '../../common/configs/config.interface';
import { SmsService } from '../../common/commonServices/sms.service';
import { RedisCacheModule } from '../cache/redis-cache.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    RedisCacheModule,
  ],
  providers: [UserAuthService, UserAuthResolver, JwtStrategy, GqlAuthGuard, PasswordService, SmsService],
  exports: [GqlAuthGuard, UserAuthService, GqlAuthGuard, SmsService],
})
export class UserAuthModule {}
