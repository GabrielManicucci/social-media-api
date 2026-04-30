import { IPostsRepository } from "../domain/posts.interface.repository";

export class ToggleLikePostUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(postId: string, userId: string): Promise<void> {
    const hasLiked = await this.postsRepository.checkUserLiked(postId, userId);

    if (!hasLiked) {
      await this.postsRepository.addLikeRecord(postId, userId);
      await this.postsRepository.incrementLikeCount(postId);
      console.log(
        `[Worker] Like registered for post ${postId} by user ${userId}`,
      );
    } else {
      await this.postsRepository.removeLikeRecord(postId, userId);
      await this.postsRepository.decrementLikeCount(postId);
      console.log(`[Worker] Like removed for post ${postId} by user ${userId}`);
    }
  }
}
