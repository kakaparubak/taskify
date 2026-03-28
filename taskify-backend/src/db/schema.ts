import { boolean, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  email: text("email").notNull(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: text("title").notNull(),
  desc: text("desc"),
  isComplete: boolean("is_complete").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const dbRelations = defineRelations({ users, tasks }, (r) => ({
  users: {
    tasks: r.many.tasks({
      from: r.users.id,
      to: r.tasks.userId,
    }),
  },
  tasks: {
    user: r.one.users({
      from: r.tasks.userId,
      to: r.users.id,
    }),
  },
}));
