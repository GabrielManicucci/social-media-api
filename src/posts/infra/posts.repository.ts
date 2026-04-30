import { IPostsRepository } from "../domain/posts.interface.repository";
import { CreatePostDtoRequest } from "../domain/posts.dto.request";
import { Post, PostWithAuthor } from "../domain/posts.dto.response";
import { postsTable, postsLikesTable, usersTable } from "../../db/schema";
import { DrizzleService } from "../../db/drizzle.service";
import { eq, desc, sql, and } from "drizzle-orm";

export class PostsRepository implements IPostsRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  private get client() {
    return this.drizzleService.client;
  }

  async create(post: CreatePostDtoRequest & { userId: string }): Promise<Post> {
    const [createdPost] = await this.client
      .insert(postsTable)
      .values({
        title: post.title,
        content: post.content,
        user_id: post.userId,
      })
      .returning();

    return createdPost as Post;
  }

  async findAll(): Promise<PostWithAuthor[]> {
    const posts = await this.client
      .select({
        post_id: postsTable.post_id,
        title: postsTable.title,
        content: postsTable.content,
        user_id: postsTable.user_id,
        likes_count: postsTable.likes_count,
        created_at: postsTable.created_at,
        updated_at: postsTable.updated_at,
        authorName: usersTable.name,
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.user_id, usersTable.user_id))
      .orderBy(desc(postsTable.created_at));

    return posts as PostWithAuthor[];
  }

  async findById(id: string): Promise<PostWithAuthor | null> {
    const [post] = await this.client
      .select({
        post_id: postsTable.post_id,
        title: postsTable.title,
        content: postsTable.content,
        user_id: postsTable.user_id,
        likes_count: postsTable.likes_count,
        created_at: postsTable.created_at,
        updated_at: postsTable.updated_at,
        authorName: usersTable.name,
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.user_id, usersTable.user_id))
      .where(eq(postsTable.post_id, id));

    return (post as PostWithAuthor) || null;
  }

  async findTopLiked(limit: number = 10): Promise<PostWithAuthor[]> {
    const posts = await this.client
      .select({
        post_id: postsTable.post_id,
        title: postsTable.title,
        content: postsTable.content,
        user_id: postsTable.user_id,
        likes_count: postsTable.likes_count,
        created_at: postsTable.created_at,
        updated_at: postsTable.updated_at,
        authorName: usersTable.name,
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.user_id, usersTable.user_id))
      .orderBy(desc(postsTable.likes_count))
      .limit(limit);

    return posts as PostWithAuthor[];
  }

  async incrementLikeCount(postId: string): Promise<void> {
    await this.client
      .update(postsTable)
      .set({
        likes_count: sql`${postsTable.likes_count} + 1`,
      })
      .where(eq(postsTable.post_id, postId));
  }

  async addLikeRecord(postId: string, userId: string): Promise<void> {
    await this.client
      .insert(postsLikesTable)
      .values({
        post_id: postId,
        user_id: userId,
      });
  }

  async checkUserLiked(postId: string, userId: string): Promise<boolean> {
    const [like] = await this.client
      .select()
      .from(postsLikesTable)
      .where(
        and(
          eq(postsLikesTable.post_id, postId),
          eq(postsLikesTable.user_id, userId)
        )
      );

    return !!like;
  }
}
