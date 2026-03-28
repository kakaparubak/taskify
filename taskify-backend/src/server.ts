import Fastify, { type FastifyError } from "fastify";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema";
import postgres from "postgres";
import { error } from "node:console";
import buildDb from "./db/db";
import userRoutes from "./modules/users/users.routes";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

// Disable prefetch as it is not supported for "Transaction" pool mode

async function buildServer() {
  const fastify = Fastify({ logger: true });

  fastify.get("/healthcheck", (req, reply) => {
    reply.code(200).send({ message: "hello!" });
  });

  fastify.register(userRoutes, { prefix: "/api/users" });
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

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
        code: "NOT_FOUND",
        message: `Route ${req.method} ${req.url} not found`,
      },
    });
  });

  return fastify;
}

export default buildServer;
