import { pgTable, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const postLikes = pgTable(
  "post_likes",
  {
    post_id: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created: timestamp("created").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.post_id, table.user_id] }),
    };
  },
);

export type PostLike = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
