import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  serial,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.uid, { onDelete: "cascade" }), // users 테이블의 uid 참조, 삭제 시 연쇄 삭제
    asset_id: text("asset_id").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      uidKey: uniqueIndex("users_id_key").on(table.user_id),
    };
  }
);
