import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  hashed_password: text('hashed_password').notNull(),
  salt: text('salt').notNull(),
  created: timestamp('created', { withTimezone: true }).defaultNow().notNull(),
  updated: timestamp('updated', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;