import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const COMMENT_QUEUE_NAME = "comment-processing-queue";

export const commentQueue = new Queue(COMMENT_QUEUE_NAME, {
  connection: redisConnection,
});
