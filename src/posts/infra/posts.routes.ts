import { FastifyInstance } from "fastify";
import { createPostSchema } from "../domain/posts.dto.request";
import {
  createPostController,
  listPostsController,
  getPostByIdController,
  listTopLikedPostsController,
  likePostController,
  commentPostController,
} from "./posts.controller";
import { AuthenticatePlugin } from "../../plugins/auth.plugin";

export async function postsRoutes(app: FastifyInstance) {
  app.post(
    "/posts",
    { onRequest: [AuthenticatePlugin] },
    createPostController,
  );
  app.post(
    "/posts/:id/like",
    { onRequest: [AuthenticatePlugin] },
    likePostController,
  );
  app.post(
    "/posts/:id/comment",
    { onRequest: [AuthenticatePlugin] },
    commentPostController,
  );

  app.get("/posts", listPostsController);
  app.get("/posts/ranking", listTopLikedPostsController);
  app.get(
    "/posts/:id",
    { onRequest: [AuthenticatePlugin] },
    getPostByIdController,
  );
}
