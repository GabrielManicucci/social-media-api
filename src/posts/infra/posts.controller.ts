import { FastifyRequest, FastifyReply } from "fastify";
import { createPostSchema } from "../domain/posts.dto.request";
import {
  createPostFactory,
  listPostsFactory,
  getPostByIdFactory,
  listTopLikedPostsFactory,
  likePostFactory,
} from "./posts.factory";

export async function createPostController(request: FastifyRequest, reply: FastifyReply) {
  const { title, content } = createPostSchema.parse(request.body);
  const userId = request.user.sub;

  const useCase = createPostFactory();
  const post = await useCase.execute({ title, content }, userId);

  reply.status(201).send(post);
}

export async function listPostsController(request: FastifyRequest, reply: FastifyReply) {
  const useCase = listPostsFactory();
  const posts = await useCase.execute();
  reply.send(posts);
}

export async function getPostByIdController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const useCase = getPostByIdFactory();
  
  try {
    const post = await useCase.execute(id);
    reply.send(post);
  } catch (error: any) {
    reply.status(404).send({ message: error.message });
  }
}

export async function listTopLikedPostsController(request: FastifyRequest, reply: FastifyReply) {
  const useCase = listTopLikedPostsFactory();
  const posts = await useCase.execute(10);
  reply.send(posts);
}

export async function likePostController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const userId = request.user.sub;

  const useCase = likePostFactory();
  await useCase.execute(id, userId);

  reply.status(202).send({ message: "Like is being processed" });
}
