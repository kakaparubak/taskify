import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { relations } from "./schema"

const buildDb = () => {
  const db = drizzle({
    schema,
    relations,
    connection: { url: process.env.DATABASE_URL!, prepare: false },
  });
  return db
};

export default buildDb
