import type { FastifyInstance } from "fastify";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthRegisterZodSchema, AuthResponseZodSchema } from "./auth.schema";
import { ErrorResponseZodSchema } from "../common.schema";
import { registerAuth } from "./auth.handlers";

const authRoutes: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
  fastify.route({
    method: "POST",
    url: "/register",
    schema: {
      body: AuthRegisterZodSchema,
      response: {
        200: AuthResponseZodSchema,
        "4xx": ErrorResponseZodSchema,
        "5xx": ErrorResponseZodSchema,
      },
    },
    handler: registerAuth(fastify),
  });
}

export default authRoutes