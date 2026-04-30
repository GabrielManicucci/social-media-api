import z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type CreatePostDtoRequest = z.infer<typeof createPostSchema>;

export const commentPostSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

export type CommentPostDtoRequest = z.infer<typeof commentPostSchema>;
