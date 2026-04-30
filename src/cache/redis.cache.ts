import { redisConnection } from "../queue/redis";

export class RedisCache {
  async get<T>(key: string): Promise<T | null> {
    const data = await redisConnection.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async set(
    key: string,
    value: unknown,
    ttlSeconds: number = 60,
  ): Promise<void> {
    await redisConnection.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await redisConnection.del(key);
  }
}

export const redisCache = new RedisCache();
