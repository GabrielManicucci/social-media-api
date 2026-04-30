import { IPostsRepository } from "../domain/posts.interface.repository";
import { PostWithDetails } from "../domain/posts.dto.response";
import { redisCache } from "../../cache/redis.cache";

export class ListPostsUseCase {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<PostWithDetails[]> {
    const cacheKey = `posts:list:page:${page}:limit:${limit}`;

    const cachedPosts = await redisCache.get<PostWithDetails[]>(cacheKey);
    if (cachedPosts) {
      console.log(
        `[CACHE HIT] Retornando posts do Redis para a chave: ${cacheKey}`,
      );
      return cachedPosts;
    }

    console.log(
      `[CACHE MISS] Buscando posts no banco de dados (PostgreSQL) para a chave: ${cacheKey}`,
    );
    const posts = await this.postsRepository.findAll(page, limit);

    console.log(
      `[CACHE SET] Salvando posts no Redis por 60 segundos na chave: ${cacheKey}`,
    );
    await redisCache.set(cacheKey, posts, 60);

    return posts;
  }
}
