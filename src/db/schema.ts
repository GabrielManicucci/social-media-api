import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  user_id: uuid("user_id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("update_at").defaultNow().notNull(),
});

// export const follows = pgTable("follows", {
//   followingUserId: uuid("following_user_id")
//     .references(() => users.id)
//     .notNull(),
//   followedUserId: uuid("followed_user_id")
//     .references(() => users.id)
//     .notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

export const postsTable = pgTable("posts", {
  post_id: uuid("post_id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  user_id: uuid("user_id")
    .references(() => usersTable.user_id)
    .notNull(),
  likes_count: integer("likes_count").default(0).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("update_at").defaultNow().notNull(),
});

export const postsLikesTable = pgTable(
  "posts_likes",
  {
    post_likes_id: uuid("post_likes_id").defaultRandom().primaryKey(),
    post_id: uuid("post_id")
      .references(() => postsTable.post_id)
      .notNull(),
    user_id: uuid("user_id")
      .references(() => usersTable.user_id)
      .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      unqLike: unique().on(table.post_id, table.user_id),
    };
  },
);

export const postsCommentsTable = pgTable("posts_comments", {
  posts_comment_id: uuid("post_commnets_id").defaultRandom().primaryKey(),
  post_id: uuid("post_id")
    .references(() => postsTable.post_id)
    .notNull(),
  user_id: uuid("user_id")
    .references(() => usersTable.user_id)
    .notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("update_at").defaultNow().notNull(),
});
