import type { FastifyError, FastifyInstance } from "fastify";

const registerErrorHandler = (fastify: FastifyInstance) => {
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
};

export default registerErrorHandler
