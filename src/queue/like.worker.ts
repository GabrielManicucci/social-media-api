import { Worker, Job } from "bullmq";
import { redisConnection } from "./redis";
import { LIKE_QUEUE_NAME } from "./like.queue";
import { toggleLikePostFactory } from "../posts/infra/posts.factory";

const toggleLikePostUseCase = toggleLikePostFactory();

export const likeWorker = new Worker(
  LIKE_QUEUE_NAME,
  async (job: Job<{ postId: string; userId: string }>) => {
    const { postId, userId } = job.data;

    try {
      await toggleLikePostUseCase.execute(postId, userId);
    } catch (error: any) {
      if (error.code === "23505") {
        console.log(`[Worker] Like duplicated (concurrency) for post ${postId}`);
      } else {
        console.error(`[Worker] Error processing like toggle:`, error);
        throw error;
      }
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
  },
);
