import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import { env } from "../env/env";

export async function AuthenticatePlugin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "Unauthorized" });
  }
}

async function authPluginImplementation(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate("authenticate", AuthenticatePlugin);
}

export const authPlugin = fastifyPlugin(authPluginImplementation);
