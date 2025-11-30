import { pgTable, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userFollow = pgTable(
  "user_follow",
  {
    follower_id: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followed_id: uuid("followed_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created: timestamp("created", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.follower_id, table.followed_id] }),
  }),
);

export type UserFollow = typeof userFollow.$inferSelect;
export type NewUserFollow = typeof userFollow.$inferInsert;
