import { sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export const lower = (email: AnyPgColumn): SQL => {
  return sql`lower(${email})`;
};
