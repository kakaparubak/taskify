import fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import type { UserIdSchema, UserCreateSchema } from "./users.schema";
import { usersTable } from "../../db/schema/users";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { handleError } from "../../utils/errorHandler";

export const getUserById =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{ Params: UserIdSchema }>,
    reply: FastifyReply,
  ) => {
    const user = await fastify.db.query.users.findFirst({
      columns: {
        passwordHash: false,
      },
      where: {
        id: req.params.id,
      },
    });

    if (!user)
      handleError(
        reply,
        404,
        "NOT_FOUND",
        `User with ID ${req.params.id} not found.`,
      );

    reply.code(200).send({
      ok: true,
      data: user,
    });
  };

// export const createUser =
//   (fastify: FastifyInstance) =>
//   async (
//     req: FastifyRequest<{ Body: UserCreateSchema }>,
//     reply: FastifyReply,
//   ) => {
//     const passwordHash = await bcrypt.hash(req.body.password, 10);
//     const { password, ...data } = req.body;
//     const user = await fastify.db
//       .insert(users)
//       .values({ ...data, passwordHash })
//       .returning({
//         id: users.id,
//         email: users.email,
//         firstName: users.firstName,
//         lastName: users.lastName,
//       });

//     console.log(user);

//     reply.code(201).send({
//       ok: true,
//       data: user[0],
//     });
//   };

export const updateUser =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{ Body: UserCreateSchema; Params: UserIdSchema }>,
    reply: FastifyReply,
  ) => {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const { password, ...data } = req.body;
    const user = await fastify.db
      .update(usersTable)
      .set({ ...data, passwordHash })
      .where(eq(usersTable.id, req.params.id))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
      });

    if (!user)
      handleError(
        reply,
        404,
        "NOT_FOUND",
        `User with ID ${req.params.id} not found.`,
      );

    reply.code(200).send({
      ok: true,
      data: user[0],
    });
  };

export const deleteUser =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{ Params: UserIdSchema }>,
    reply: FastifyReply,
  ) => {
    const user = await fastify.db
      .delete(usersTable)
      .where(eq(usersTable.id, req.params.id))
      .returning();

    if (!user)
      handleError(
        reply,
        404,
        "NOT_FOUND",
        `User with ID ${req.params.id} not found.`,
      );

    reply.code(200).send({
      ok: true,
      data: {},
    });
  };
