import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env/env";
import { usersRoutes } from "./users/infra/users.routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(cors, {
  origin: "*",
});

app.register(usersRoutes);
