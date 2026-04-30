import { Queue } from "bullmq";

export class LikePostUseCase {
  constructor(private readonly likeQueue: Queue) {}

  async execute(postId: string, userId: string): Promise<void> {
    await this.likeQueue.add("process-like", { postId, userId });
  }
}
