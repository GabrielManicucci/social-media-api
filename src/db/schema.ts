import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("user_id").defaultRandom().primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
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

export const posts = pgTable("posts", {
  id: uuid("post_id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  likes_count: integer("likes_count").default(0).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("update_at").defaultNow().notNull(),
});

export const postsLikes = pgTable(
  "posts_likes",
  {
    id: uuid("post_likes_id").defaultRandom().primaryKey(),
    post_id: uuid("post_id")
      .references(() => posts.id)
      .notNull(),
    user_id: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      unqLike: unique().on(table.post_id, table.user_id),
    };
  },
);

export const postsComments = pgTable("posts_comments", {
  id: uuid("post_commnets_id").defaultRandom().primaryKey(),
  post_id: uuid("post_id")
    .references(() => posts.id)
    .notNull(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("update_at").defaultNow().notNull(),
});
