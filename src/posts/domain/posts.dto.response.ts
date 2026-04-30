import { PostEntity } from "./posts.entity";

export interface Post extends PostEntity {}

export interface PostLikeDetail {
  user_id: string;
  name: string;
  created_at: Date;
}

export interface PostCommentDetail {
  post_comment_id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: Date;
}

export interface PostWithDetails extends Post {
  authorName: string;
  likes: PostLikeDetail[];
  comments: PostCommentDetail[];
}

export interface PostWithAuthor extends Post {
  authorName: string;
}
