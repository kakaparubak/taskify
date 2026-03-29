import Fastify from "fastify";
import "dotenv/config";
import userRoutes from "./modules/users/users.routes";
import registerJwt from "./plugins/jwt";
import registerErrorHandler from "./plugins/error";
import registerZod from "./plugins/zod";
import registerDb from "./plugins/db";
import authRoutes from "./modules/auth/auth.routes";

// Disable prefetch as it is not supported for "Transaction" pool mode

async function buildServer() {
  const fastify = Fastify({ logger: true });

  fastify.get("/healthcheck", (req, reply) => {
    reply.code(200).send({ message: "hello!" });
  });

  registerDb(fastify);
  registerZod(fastify);
  registerErrorHandler(fastify);
  registerJwt(fastify);

  fastify.register(userRoutes, { prefix: "/api/v1/users" });
  fastify.register(authRoutes, { prefix: "/api/v1/auth" });

  return fastify;
}

export default buildServer;
