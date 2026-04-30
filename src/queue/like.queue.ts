import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const LIKE_QUEUE_NAME = "like-processing-queue";

export const likeQueue = new Queue(LIKE_QUEUE_NAME, {
  connection: redisConnection,
});
