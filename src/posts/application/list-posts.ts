import { IPostsRepository } from "../domain/posts.interface.repository";
import { PostWithDetails } from "../domain/posts.dto.response";

export class ListPostsUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(): Promise<PostWithDetails[]> {
    return await this.postsRepository.findAll();
  }
}
