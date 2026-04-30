import { relations } from "drizzle-orm";
import {
  postsTable,
  postsLikesTable,
  usersTable,
  postsCommentsTable,
} from "./schema";

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  likes: many(postsLikesTable),
  comments: many(postsCommentsTable),
  //   follows: many(follows),
}));

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [postsTable.user_id],
    references: [usersTable.user_id],
  }),
  likes: many(postsLikesTable),
  comments: many(postsCommentsTable),
}));

export const postsLikesRelations = relations(postsLikesTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [postsLikesTable.post_id],
    references: [postsTable.post_id],
  }),
  user: one(usersTable, {
    fields: [postsLikesTable.user_id],
    references: [usersTable.user_id],
  }),
}));
