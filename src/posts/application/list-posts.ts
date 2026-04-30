import { IPostsRepository } from "../domain/posts.interface.repository";
import { PostWithAuthor } from "../domain/posts.dto.response";

export class ListPostsUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(): Promise<PostWithAuthor[]> {
    return await this.postsRepository.findAll();
  }
}
