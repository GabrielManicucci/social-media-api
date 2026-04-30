import { IPostsRepository } from "../domain/posts.interface.repository";
import { PostWithAuthor } from "../domain/posts.dto.response";

export class ListTopLikedPostsUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(limit: number = 10): Promise<PostWithAuthor[]> {
    return await this.postsRepository.findTopLiked(limit);
  }
}
