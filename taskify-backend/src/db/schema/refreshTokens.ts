import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./users";

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  tokenHash: text("token_hash").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiredAt: timestamp("expired_at").notNull(),
});
