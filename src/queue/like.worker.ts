import { Worker, Job } from "bullmq";
import { redisConnection } from "./redis";
import { LIKE_QUEUE_NAME } from "./like.queue";
import { PostsRepository } from "../posts/infra/posts.repository";
import { drizzleService } from "../db/drizzle.service";

const postsRepository = new PostsRepository(drizzleService);

export const likeWorker = new Worker(
  LIKE_QUEUE_NAME,
  async (job: Job<{ postId: string; userId: string }>) => {
    const { postId, userId } = job.data;

    try {
      const hasLiked = await postsRepository.checkUserLiked(postId, userId);
      
      if (!hasLiked) {
        await postsRepository.addLikeRecord(postId, userId);
        await postsRepository.incrementLikeCount(postId);
        console.log(`[Worker] Like registered for post ${postId} by user ${userId}`);
      } else {
        console.log(`[Worker] User ${userId} already liked post ${postId}`);
      }
    } catch (error: any) {
      if (error.code === '23505') {
        console.log(`[Worker] Like duplicated (concurrency) for post ${postId}`);
      } else {
        console.error(`[Worker] Error processing like:`, error);
        throw error;
      }
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);
