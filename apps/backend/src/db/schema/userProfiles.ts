import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  about: text("about"),
  photo: text("photo"), // base64 encoded image
  photo_content_type: text("photo_content_type"),
  location: text("location"),
  website: text("website"),
  created: timestamp("created", { withTimezone: true }).defaultNow().notNull(),
  updated: timestamp("updated", { withTimezone: true }).defaultNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
