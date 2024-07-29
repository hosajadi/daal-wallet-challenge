import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<string | null> {
    return await this.cache.get(key);
  }

  async saveJsonToCache(key: string, data: any, ttl?: number): Promise<void> {
    const jsonString = JSON.stringify(data);
    await this.cache.set(key, jsonString, ttl);
  }

  async getJsonFromCache<T>(key: string): Promise<T | null> {
    const jsonString: string = await this.cache.get(key);
    return jsonString ? JSON.parse(jsonString) : null;
  }

  async set(key: string, value: unknown, ttl?: number) {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
