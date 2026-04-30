import { CreatePostDtoRequest } from "./posts.dto.request";
import { Post, PostWithDetails } from "./posts.dto.response";

export interface IPostsRepository {
  create: (post: CreatePostDtoRequest & { userId: string }) => Promise<Post>;
  findAll: (page?: number, limit?: number) => Promise<PostWithDetails[]>;
  findById: (id: string) => Promise<PostWithDetails | null>;
  findTopLiked: (limit?: number) => Promise<PostWithDetails[]>;
  incrementLikeCount: (postId: string) => Promise<void>;
  decrementLikeCount: (postId: string) => Promise<void>;
  addLikeRecord: (postId: string, userId: string) => Promise<void>;
  removeLikeRecord: (postId: string, userId: string) => Promise<void>;
  checkUserLiked: (postId: string, userId: string) => Promise<boolean>;
  addComment: (
    postId: string,
    userId: string,
    description: string,
  ) => Promise<void>;
}
