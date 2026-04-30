import { FastifyReply } from "fastify";
import z from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .meta({ example: "John Doe", description: "User's full name" }),
  email: z
    .email()
    .meta({
      example: "example@pagana.com",
      description: "User's email address",
    }),
  password: z
    .string()
    .min(6)
    .meta({ example: "asdfasdf", description: "User's password" }),
});

export const updateUserSchema = z.object({
  name: z.string(),
  email: z.email(),
});

export const authSchema = z.object({
  email: z
    .email()
    .meta({ example: "example@pagana.com", description: "User email" }),
  password: z
    .string()
    .min(6)
    .meta({ example: "asdfasdf", description: "User password" }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type CreateUserDtoRequest = z.infer<typeof createUserSchema>;
export type UpdateUserDtoRequest = z.infer<typeof updateUserSchema>;

export type AuthInterface = z.infer<typeof authSchema>;
export interface AuthDtoRequest extends AuthInterface {
  reply: FastifyReply;
}
