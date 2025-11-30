import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  photo: text("photo"), // Base64 encoded image
  photo_content_type: text("photo_content_type"),
  posted_by: uuid("posted_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  created: timestamp("created").defaultNow().notNull(),
  updated: timestamp("updated").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
