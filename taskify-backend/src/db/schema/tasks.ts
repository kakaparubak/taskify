import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./users";

export const tasks = pgTable("tasks", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: text("title").notNull(),
  desc: text("desc"),
  isComplete: boolean("is_complete").default(false).notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});