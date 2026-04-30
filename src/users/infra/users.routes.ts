import { FastifyInstance } from "fastify";
import { registerController, authController } from "./users.controller";
import { createUserSchema, authSchema } from "../domain/users.dto.request";

export async function usersRoutes(app: FastifyInstance, options: any) {
  app.post(
    "/users/register",
    registerController,
  );

  app.post(
    "/users/auth",
    authController,
  );
}
