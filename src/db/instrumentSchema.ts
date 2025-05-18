import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const instruments = pgTable("instruments", {
  id: serial("id").primaryKey(),
  name: text("name"),
});
