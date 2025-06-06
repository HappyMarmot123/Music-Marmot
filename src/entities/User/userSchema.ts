import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  serial,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    uid: text("uid").notNull(),
    email: text("email").notNull(),
    full_name: text("full_name"),
    avatar_url: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      uidKey: uniqueIndex("users_uid_key").on(table.uid),
      emailKey: uniqueIndex("users_email_key").on(table.email),
    };
  }
);
