import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CachingConfig } from '../../common/configs/config.interface';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: configService.get<CachingConfig>('cache').isGlobal,
        store: redisStore,
        host: configService.get<CachingConfig>('cache').host,
        port: configService.get<CachingConfig>('cache').port,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
