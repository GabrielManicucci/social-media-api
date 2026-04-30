import { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyPlugin from "fastify-plugin";

async function corsPluginImplementation(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: "*",
  });
}

export const corsPlugin = fastifyPlugin(corsPluginImplementation);
