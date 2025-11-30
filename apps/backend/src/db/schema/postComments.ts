import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const postComments = pgTable("post_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  post_id: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  posted_by: uuid("posted_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  created: timestamp("created").defaultNow().notNull(),
});

export type PostComment = typeof postComments.$inferSelect;
export type NewPostComment = typeof postComments.$inferInsert;
