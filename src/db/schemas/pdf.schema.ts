import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pdfTable = sqliteTable("pdf", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  path: text("path").notNull(),
  previewPath: text("previewPath").notNull(),

  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
