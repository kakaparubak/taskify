import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";
import { relations } from "./schema/index";

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof buildDb>;
  }
}

const buildDb = () => {
  const db = drizzle({
    schema,
    relations,
    connection: { url: process.env.DATABASE_URL!, prepare: false },
  });

  return db;
};

export default buildDb;
