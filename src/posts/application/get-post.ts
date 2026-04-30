import { IPostsRepository } from "../domain/posts.interface.repository";
import { PostWithDetails } from "../domain/posts.dto.response";

export class GetPostByIdUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(id: string): Promise<PostWithDetails> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  }
}
