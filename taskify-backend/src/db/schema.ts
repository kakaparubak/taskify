import { boolean, pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { lower } from "./utils";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
}, (table) => [
  uniqueIndex('emailUniqueIndex').on(lower(table.email))
]);

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

export const relations = defineRelations({ users, tasks }, (r) => ({
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
