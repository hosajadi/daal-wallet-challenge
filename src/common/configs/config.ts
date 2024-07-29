import type { Config, ENV } from './config.interface';
import * as process from 'process';
const config: Config = {
  nest: {
    port: parseInt(process.env.PORT) || 3003,
    env: process.env.NEST_ENV as ENV,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.0',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: process.env.EXPIRES_IN || '100d',
    refreshIn: process.env.REFRESH_IN || '200d',
    bcryptSaltOrRound: 10,
  },
  cache: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    isGlobal: true,
    cachingEndpoint: process.env.CACHING_ENDPOINT!,
    ttl: parseInt(process.env.REDIS_CACHE_TTL, 10),
    max: parseInt(process.env.REDIS_CACHE_MAX, 10),
    rateLimit: parseInt(process.env.CACHE_CRAWLER_RATE_LIMIT_MILLI_SECS!, 10),
  },
};

export const configFactory = (): Config => config;
