import { IPostsRepository } from "../domain/posts.interface.repository";
import { CreatePostDtoRequest } from "../domain/posts.dto.request";
import { Post } from "../domain/posts.dto.response";
import { redisCache } from "../../cache/redis.cache";

export class CreatePostUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(post: CreatePostDtoRequest, userId: string): Promise<Post> {
    const createdPost = await this.postsRepository.create({ ...post, userId });

    await redisCache.del("posts:list:page:1:limit:10");

    return createdPost;
  }
}
