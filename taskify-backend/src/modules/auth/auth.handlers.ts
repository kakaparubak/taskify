import {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import type { AuthRegisterSchema } from "./auth.schema";
import { users } from "../../db/schema";
import * as bcrypt from "bcrypt";
import { handleError } from "../../utils/errorHandler";
import {
  generateTokens,
  setRefreshCookies,
  storeRefreshToken,
} from "./auth.service";

export const registerAuth =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{ Body: AuthRegisterSchema }>,
    reply: FastifyReply,
  ) => {
    try {
      const { password, ...userData } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const [user] = await fastify.db
        .insert(users)
        .values({ passwordHash, ...userData })
        .returning({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        });

      if (!user) {
        throw new Error("Failed creating user");
        return;
      }

      const { accessToken, refreshToken } = generateTokens(fastify, user.id);
      await storeRefreshToken(fastify, user.id, refreshToken);
      setRefreshCookies(reply, refreshToken);

      reply.code(201).send({
        ok: true,
        data: {
          accessToken,
        },
      });
    } catch (error: any) {
      if (error.code === "23505")
        handleError(
          reply,
          409,
          "CONFLICT",
          `User with email ${req.body.email} already exists.`,
        );

      throw error;
    }
  };

export const authLogin =
  (fastify: FastifyInstance) =>
  (req: FastifyRequest, reply: FastifyRequest) => {};
