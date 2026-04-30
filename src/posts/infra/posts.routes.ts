import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  createPostController,
  listPostsController,
  getPostByIdController,
  listTopLikedPostsController,
  likePostController,
  commentPostController,
} from "./posts.controller";
import { AuthenticatePlugin } from "../../plugins/auth.plugin";
import {
  createPostSchema,
  commentPostSchema,
  listPostsQuerySchema,
} from "../domain/posts.dto.request";

export async function postsRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/posts",
    {
      onRequest: [AuthenticatePlugin],
      schema: {
        tags: ["Posts"],
        summary: "Create a new post",
        body: createPostSchema,
      },
    },
    createPostController,
  );
  
  typedApp.post(
    "/posts/:id/like",
    {
      onRequest: [AuthenticatePlugin],
      schema: {
        tags: ["Posts"],
        summary: "Like or unlike a post",
        params: z.object({ id: z.string().uuid() }),
      },
    },
    likePostController,
  );
  
  typedApp.post(
    "/posts/:id/comment",
    {
      onRequest: [AuthenticatePlugin],
      schema: {
        tags: ["Posts"],
        summary: "Add a comment to a post",
        params: z.object({ id: z.string().uuid() }),
        body: commentPostSchema,
      },
    },
    commentPostController,
  );

  typedApp.get(
    "/posts",
    {
      schema: {
        tags: ["Posts"],
        summary: "List all posts (Feed)",
        querystring: listPostsQuerySchema,
      },
    },
    listPostsController,
  );
  
  typedApp.get(
    "/posts/ranking",
    {
      schema: {
        tags: ["Posts"],
        summary: "Get top 10 most liked posts",
      },
    },
    listTopLikedPostsController,
  );
  
  typedApp.get(
    "/posts/:id",
    {
      onRequest: [AuthenticatePlugin],
      schema: {
        tags: ["Posts"],
        summary: "Get a post by ID",
        params: z.object({ id: z.string().uuid() }),
      },
    },
    getPostByIdController,
  );
}
