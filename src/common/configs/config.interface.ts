export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  cache: CachingConfig;
}

export type ENV = 'production' | 'stage' | 'localhost';

export interface NestConfig {
  port: number;
  env: ENV;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface CachingConfig {
  host: string;
  port: number;
  isGlobal: boolean;
  rateLimit: number;
  ttl: number;
  max: number;
  cachingEndpoint: string;
}
