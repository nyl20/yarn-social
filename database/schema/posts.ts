import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { users } from "./auth"
import { relations } from "drizzle-orm"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod"


export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category"),
  description: text("description"),
  image: text("image"),
  tag: text("tag").array()
})

export const usersPostRelations = relations(users, ({ many }) => ({
  profiles: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}))


// export const selectUserSchema = createSelectSchema(users);
// export type User = z.infer<typeof selectUserSchema>;

export const selectPostSchema = createSelectSchema(posts);
export type Post = z.infer<typeof selectPostSchema>;

export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().nonempty("Title cannot be empty"),
})
export type NewPost = z.infer<typeof insertPostSchema>;

export default {
  users,
  posts
};