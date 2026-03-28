import Fastify, { type FastifyError } from "fastify";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema";
import postgres from "postgres";
import { error } from "node:console";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const db = drizzle({
  schema,
  connection: { url: process.env.DATABASE_URL!, prepare: false },
});

async function buildServer() {
  const fastify = Fastify({ logger: true });

  fastify.get("/healthcheck", (req, reply) => {
    reply.code(200).send({ message: "hello!" });
  });

  fastify.setErrorHandler((error: FastifyError, req, reply) => {
    fastify.log.error(error);
    reply.code(error.statusCode ?? 500).send({
      ok: false,
      error: {
        code: error.code ?? "INTERNAL_ERROR",
        message: error.message,
      },
    });
  });

  fastify.setNotFoundHandler((req, reply) => {
    reply.code(404).send({
      ok: false,
      error: {
        code: 404,
        message: `Route ${req.method} ${req.url} not found`
      }
    })
  })

  return fastify;
}

export default buildServer;
