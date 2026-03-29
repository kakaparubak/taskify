import type { FastifyInstance } from "fastify";
import buildDb from "../db/db";

const registerDb = (fastify: FastifyInstance) => {
  const db = buildDb();

  fastify.decorate("db", db);
};

export default registerDb;
