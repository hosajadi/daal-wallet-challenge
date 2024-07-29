import { GraphQLModule } from '@nestjs/graphql';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { UserAuthModule } from '../auth/user-auth.module';
import { UsersModule } from '../users/users.module';
import { configFactory } from '../../common/configs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from '../../common/commonServices/gql-config.service';
import { RedisCacheModule } from '../cache/redis-cache.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configFactory] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    UserAuthModule,
    UsersModule,
    RedisCacheModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
