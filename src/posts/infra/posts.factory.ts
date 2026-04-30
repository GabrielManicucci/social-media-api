import { PostsRepository } from "./posts.repository";
import { drizzleService } from "../../db/drizzle.service";
import { likeQueue } from "../../queue/like.queue";
import { commentQueue } from "../../queue/comment.queue";
import { CreatePostUseCase } from "../application/create-post";
import { ListPostsUseCase } from "../application/list-posts";
import { GetPostByIdUseCase } from "../application/get-post";
import { ListTopLikedPostsUseCase } from "../application/list-top-posts";
import { LikePostUseCase } from "../application/like-post";
import { CommentPostUseCase } from "../application/comment-post";
import { ToggleLikePostUseCase } from "../application/toggle-like-post";

export function createPostFactory() {
  const repository = new PostsRepository(drizzleService);
  return new CreatePostUseCase(repository);
}

export function listPostsFactory() {
  const repository = new PostsRepository(drizzleService);
  return new ListPostsUseCase(repository);
}

export function getPostByIdFactory() {
  const repository = new PostsRepository(drizzleService);
  return new GetPostByIdUseCase(repository);
}

export function listTopLikedPostsFactory() {
  const repository = new PostsRepository(drizzleService);
  return new ListTopLikedPostsUseCase(repository);
}

export function likePostFactory() {
  return new LikePostUseCase(likeQueue);
}

export function commentPostFactory() {
  return new CommentPostUseCase(commentQueue);
}

export function toggleLikePostFactory() {
  const repository = new PostsRepository(drizzleService);
  return new ToggleLikePostUseCase(repository);
}
