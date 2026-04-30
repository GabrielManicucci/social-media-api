import { Worker, Job } from "bullmq";
import { redisConnection } from "./redis";
import { COMMENT_QUEUE_NAME } from "./comment.queue";
import { PostsRepository } from "../posts/infra/posts.repository";
import { drizzleService } from "../db/drizzle.service";

const postsRepository = new PostsRepository(drizzleService);

export const commentWorker = new Worker(
  COMMENT_QUEUE_NAME,
  async (job: Job<{ postId: string; userId: string; description: string }>) => {
    const { postId, userId, description } = job.data;

    try {
      await postsRepository.addComment(postId, userId, description);
      console.log(`[Worker] Comment registered for post ${postId} by user ${userId}`);
    } catch (error: any) {
      console.error(`[Worker] Error processing comment:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);
