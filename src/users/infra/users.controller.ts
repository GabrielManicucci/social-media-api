import { FastifyRequest, FastifyReply } from "fastify";
import { createUserSchema, authSchema } from "../domain/users.dto.request";
import { RegisterUserFactory, AuthUserFactory } from "./users.factory";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password } = createUserSchema.parse(request.body);

  try {
    const useCase = RegisterUserFactory();
    const user = await useCase.execute({ name, email, password });

    reply.status(201).send(user);
  } catch (error: unknown) {
    reply.status(400).send({
      message: error instanceof Error ? error.message : "Error creating user",
      error,
    });
  }
}

export async function authController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authSchema.parse(request.body);

  try {
    const useCase = AuthUserFactory();
    const result = await useCase.execute({ email, password, reply });

    reply.status(200).send(result);
  } catch (error: unknown) {
    reply.status(401).send({
      message: error instanceof Error ? error.message : "Unauthorized",
      error,
    });
  }
}
