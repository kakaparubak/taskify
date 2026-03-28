import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import type { UserIdSchema, UserRegisterSchema } from "./users.schema";
import { db } from "../../app";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { handleError } from "../../utils/errorHandler";

export const getUserById = async (
  req: FastifyRequest<{ Params: UserIdSchema }>,
  reply: FastifyReply,
) => {
  const user = await db.query.users.findFirst({
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

export const createUser = async (
  req: FastifyRequest<{ Body: UserRegisterSchema }>,
  reply: FastifyReply,
) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const { password, ...data } = req.body;
  const user = await db
    .insert(users)
    .values({ ...data, passwordHash })
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    });

  console.log(user);

  reply.code(201).send({
    ok: true,
    data: user[0],
  });
};

export const updateUser = async (
  req: FastifyRequest<{ Body: UserRegisterSchema; Params: UserIdSchema }>,
  reply: FastifyReply,
) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const { password, ...data } = req.body;
  const user = await db
    .update(users)
    .set({ ...data, passwordHash })
    .where(eq(users.id, req.params.id))
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
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

export const deleteUser = async (
  req: FastifyRequest<{ Params: UserIdSchema }>,
  reply: FastifyReply,
) => {
  const user = await db
    .delete(users)
    .where(eq(users.id, req.params.id))
    .returning();

  if (!user)
    handleError(
      reply,
      404,
      "NOT_FOUND",
      `User with ID ${req.params.id} not found.`,
    );

  reply.code(204).send({
    ok: true,
    data: {},
  });
};
