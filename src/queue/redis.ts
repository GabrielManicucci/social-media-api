import { Redis } from "ioredis";
import { env } from "../env/env";

export const redisConnection = new Redis(env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
