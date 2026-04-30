import { postsTable, postsLikesTable } from "../../db/schema";

export type PostEntity = typeof postsTable.$inferSelect;
export type PostLikeEntity = typeof postsLikesTable.$inferSelect;
