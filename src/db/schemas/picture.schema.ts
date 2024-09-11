import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pictureTable = sqliteTable("pictures", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hashBlur: text("hashBlur").notNull(),
  path: text("path").notNull(),
  thumbPath: text("thumbPath").notNull(),

  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
