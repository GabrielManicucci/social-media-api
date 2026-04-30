import { IPostsRepository } from "../domain/posts.interface.repository";
import { CreatePostDtoRequest } from "../domain/posts.dto.request";
import { Post } from "../domain/posts.dto.response";

export class CreatePostUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(post: CreatePostDtoRequest, userId: string): Promise<Post> {
    return await this.postsRepository.create({ ...post, userId });
  }
}
