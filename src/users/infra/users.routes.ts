import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { registerController, authController } from "./users.controller";
import { createUserSchema, authSchema } from "../domain/users.dto.request";

export async function usersRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/users/register",
    {
      schema: {
        tags: ["Users"],
        body: createUserSchema,
        description: "Register a new user",
      },
    },
    registerController,
  );

  typedApp.post(
    "/users/auth",
    {
      schema: {
        tags: ["Users"],
        body: authSchema,
        description: "Authenticate user and get JWT token",
      },
    },
    authController,
  );
}
