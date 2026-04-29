import { relations } from "drizzle-orm";
import { posts, postsLikes, users, postsComments } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(postsLikes),
  comments: many(postsComments),
  //   follows: many(follows),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.user_id],
    references: [users.id],
  }),
  likes: many(postsLikes),
  comments: many(postsComments),
}));

export const postsLikesRelations = relations(postsLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postsLikes.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postsLikes.user_id],
    references: [users.id],
  }),
}));
