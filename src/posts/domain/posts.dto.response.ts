import { PostEntity } from "./posts.entity";

export interface Post extends PostEntity {}

export interface PostWithAuthor extends Post {
  authorName: string;
}
