import { CreatePostDtoRequest } from "./posts.dto.request";
import { Post, PostWithAuthor } from "./posts.dto.response";

export interface IPostsRepository {
  create: (post: CreatePostDtoRequest & { userId: string }) => Promise<Post>;
  findAll: () => Promise<PostWithAuthor[]>;
  findById: (id: string) => Promise<PostWithAuthor | null>;
  findTopLiked: (limit?: number) => Promise<PostWithAuthor[]>;
  incrementLikeCount: (postId: string) => Promise<void>;
  addLikeRecord: (postId: string, userId: string) => Promise<void>;
  checkUserLiked: (postId: string, userId: string) => Promise<boolean>;
}
