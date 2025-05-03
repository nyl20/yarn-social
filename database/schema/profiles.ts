import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { users } from "./auth"
import { relations } from "drizzle-orm"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod"


export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type")
    .references(() => users.role, { onDelete: "cascade" }),
  bio: text("bio"),
  image: text("image"),
  url: text("url")
})

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))


export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;

export const selectProfileSchema = createSelectSchema(profiles);
export type Todo = z.infer<typeof selectProfileSchema>;

export const insertProfileSchema = createInsertSchema(profiles, {
  username: z.string().nonempty("Username cannot be empty"),
})
export type NewProfile = z.infer<typeof insertProfileSchema>;

export default {
  users,
  profiles
};