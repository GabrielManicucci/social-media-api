import { Queue } from "bullmq";

export class CommentPostUseCase {
  constructor(private readonly commentQueue: Queue) {}

  async execute(
    postId: string,
    userId: string,
    description: string,
  ): Promise<void> {
    await this.commentQueue.add("process-comment", {
      postId,
      userId,
      description,
    });
  }
}
