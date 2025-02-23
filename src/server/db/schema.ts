import { InferSelectModel } from "drizzle-orm"
import { pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core"

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("Post_name_idx").on(table.title)
  ]
)

export interface Post extends InferSelectModel<typeof posts> {}