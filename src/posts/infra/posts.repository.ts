import { IPostsRepository } from "../domain/posts.interface.repository";
import { CreatePostDtoRequest } from "../domain/posts.dto.request";
import {
  Post,
  PostWithDetails,
  PostLikeDetail,
  PostCommentDetail,
} from "../domain/posts.dto.response";
import {
  postsTable,
  postsLikesTable,
  postsCommentsTable,
  usersTable,
} from "../../db/schema";
import { DrizzleService } from "../../db/drizzle.service";
import { aliasedTable, desc, eq, sql, and } from "drizzle-orm";

export class PostsRepository implements IPostsRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  private get client() {
    return this.drizzleService.client;
  }

  private getBaseQuery() {
    const likesUserTable = aliasedTable(usersTable, "likes_users");
    const commentsUserTable = aliasedTable(usersTable, "comments_users");

    const likesSubquery = this.client
      .select({
        post_id: postsLikesTable.post_id,
        likes: sql<PostLikeDetail[]>`
          COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'user_id', ${postsLikesTable.user_id},
                'name', ${likesUserTable.name},
                'created_at', ${postsLikesTable.created_at}
              )
            ) FILTER (WHERE ${postsLikesTable.user_id} IS NOT NULL),
            '[]'::jsonb
          )
        `.as("likes"),
      })
      .from(postsLikesTable)
      .leftJoin(
        likesUserTable,
        eq(postsLikesTable.user_id, likesUserTable.user_id),
      )
      .groupBy(postsLikesTable.post_id)
      .as("likes_sq");

    const commentsSubquery = this.client
      .select({
        post_id: postsCommentsTable.post_id,
        comments: sql<PostCommentDetail[]>`
          COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'post_comment_id', ${postsCommentsTable.posts_comment_id},
                'user_id', ${postsCommentsTable.user_id},
                'name', ${commentsUserTable.name},
                'description', ${postsCommentsTable.description},
                'created_at', ${postsCommentsTable.created_at}
              )
            ) FILTER (WHERE ${postsCommentsTable.posts_comment_id} IS NOT NULL),
            '[]'::jsonb
          )
        `.as("comments"),
      })
      .from(postsCommentsTable)
      .leftJoin(
        commentsUserTable,
        eq(postsCommentsTable.user_id, commentsUserTable.user_id),
      )
      .groupBy(postsCommentsTable.post_id)
      .as("comments_sq");

    return this.client
      .select({
        post_id: postsTable.post_id,
        title: postsTable.title,
        content: postsTable.content,
        user_id: postsTable.user_id,
        likes_count: postsTable.likes_count,
        created_at: postsTable.created_at,
        updated_at: postsTable.updated_at,
        authorName: usersTable.name,
        likes: sql<PostLikeDetail[]>`COALESCE(${likesSubquery.likes}, '[]'::jsonb)`,
        comments: sql<PostCommentDetail[]>`COALESCE(${commentsSubquery.comments}, '[]'::jsonb)`,
      })
      .from(postsTable)
      .innerJoin(usersTable, eq(postsTable.user_id, usersTable.user_id))
      .leftJoin(likesSubquery, eq(postsTable.post_id, likesSubquery.post_id))
      .leftJoin(
        commentsSubquery,
        eq(postsTable.post_id, commentsSubquery.post_id),
      );
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

  async findAll(page: number = 1, limit: number = 10): Promise<PostWithDetails[]> {
    const offset = (page - 1) * limit;
    return await this.getBaseQuery()
      .orderBy(desc(postsTable.created_at))
      .limit(limit)
      .offset(offset);
  }

  async findById(id: string): Promise<PostWithDetails | null> {
    const [post] = await this.getBaseQuery().where(eq(postsTable.post_id, id));

    return post || null;
  }

  async findTopLiked(limit: number = 10): Promise<PostWithDetails[]> {
    return await this.getBaseQuery()
      .orderBy(desc(postsTable.likes_count))
      .limit(limit);
  }

  async incrementLikeCount(postId: string): Promise<void> {
    await this.client
      .update(postsTable)
      .set({
        likes_count: sql`${postsTable.likes_count} + 1`,
      })
      .where(eq(postsTable.post_id, postId));
  }

  async decrementLikeCount(postId: string): Promise<void> {
    await this.client
      .update(postsTable)
      .set({
        likes_count: sql`GREATEST(${postsTable.likes_count} - 1, 0)`,
      })
      .where(eq(postsTable.post_id, postId));
  }

  async addLikeRecord(postId: string, userId: string): Promise<void> {
    await this.client.insert(postsLikesTable).values({
      post_id: postId,
      user_id: userId,
    });
  }

  async removeLikeRecord(postId: string, userId: string): Promise<void> {
    await this.client
      .delete(postsLikesTable)
      .where(
        and(
          eq(postsLikesTable.post_id, postId),
          eq(postsLikesTable.user_id, userId),
        ),
      );
  }

  async checkUserLiked(postId: string, userId: string): Promise<boolean> {
    const [like] = await this.client
      .select()
      .from(postsLikesTable)
      .where(
        and(
          eq(postsLikesTable.post_id, postId),
          eq(postsLikesTable.user_id, userId),
        ),
      );

    return !!like;
  }

  async addComment(
    postId: string,
    userId: string,
    description: string,
  ): Promise<void> {
    await this.client.insert(postsCommentsTable).values({
      post_id: postId,
      user_id: userId,
      description,
    });
  }
}
