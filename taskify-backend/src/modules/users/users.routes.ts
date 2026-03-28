import type { FastifyInstance } from "fastify";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "./users.handlers";
import {
  DeleteUserResponseZodSchema,
  UserIdZodSchema,
  UserRegisterZodSchema,
  UserResponseZodSchema,
} from "./users.schema";
import { ErrorResponseZodSchema } from "../common.schema";

const userRoutes: FastifyPluginAsyncZod = async (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/:id",
    schema: {
      params: UserIdZodSchema,
      response: {
        200: UserResponseZodSchema,
        "4xx": ErrorResponseZodSchema,
        "5xx": ErrorResponseZodSchema
      },
    },
    handler: getUserById,
  });

  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: UserRegisterZodSchema,
      response: {
        201: UserResponseZodSchema,
        "4xx": ErrorResponseZodSchema,
        "5xx": ErrorResponseZodSchema
      },
    },
    handler: createUser,
  });

  fastify.route({
    method: "PUT",
    url: "/:id",
    schema: {
      params: UserIdZodSchema,
      body: UserRegisterZodSchema,
      response: {
        200: UserResponseZodSchema,
        "4xx": ErrorResponseZodSchema,
        "5xx": ErrorResponseZodSchema
      },
    },
    handler: updateUser,
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: UserIdZodSchema,
      response: {
        204: DeleteUserResponseZodSchema,
        "4xx": ErrorResponseZodSchema,
        "5xx": ErrorResponseZodSchema
      },
    },
    handler: deleteUser,
  });
};

export default userRoutes;
