import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { usersTable } from "./users";

export const refreshTokensTable = pgTable("refresh_tokens", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  tokenHash: text("token_hash").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiredAt: timestamp("expired_at").notNull(),
});
