import {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import type { AuthLoginSchema, AuthRegisterSchema } from "./auth.schema";
import { refreshTokensTable, usersTable } from "../../db/schema";
import * as bcrypt from "bcrypt";
import { handleError } from "../../utils/errorHandler";
import {
  generateTokens,
  setRefreshCookies,
  storeRefreshToken,
} from "./auth.service";
import { eq } from "drizzle-orm";

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
        .insert(usersTable)
        .values({ passwordHash, ...userData })
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
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

export const loginAuth =
  (fastify: FastifyInstance) =>
  async (
    req: FastifyRequest<{ Body: AuthLoginSchema }>,
    reply: FastifyReply,
  ) => {
    const { email, password } = req.body;
    const user = await fastify.db.query.users.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      handleError(
        reply,
        401,
        "INVALID_CREDENTIALS",
        `The email or password that you inputted is invalid.`,
      );
      return;
    }

    const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

    if (!isAuthenticated) {
      handleError(
        reply,
        401,
        "INVALID_CREDENTIALS",
        `The email or password that you inputted is invalid.`,
      );
      return;
    }

    const { accessToken, refreshToken } = generateTokens(fastify, user.id);
    await storeRefreshToken(fastify, user.id, refreshToken);
    setRefreshCookies(reply, refreshToken);

    reply.code(200).send({
      ok: true,
      data: {
        accessToken,
      },
    });
  };

export const refreshAuth =
  (fastify: FastifyInstance) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken: string | undefined = req.cookies.refresh_token;
    if (!refreshToken) {
      return handleError(reply, 401, "INVALID_TOKEN", "Token is invalid.");
    }

    let payload;
    try {
      payload = fastify.jwt.verify<{ userId: string }>(refreshToken);
    } catch (error) {
      return handleError(reply, 401, "INVALID_TOKEN", "Token is invalid.");
    }

    const refreshTokens = await fastify.db.query.refreshTokens.findMany({
      where: {
        userId: payload.userId,
      },
    });

    let validRefreshToken = undefined;
    const now = new Date(Date.now());
    for (const curr of refreshTokens) {
      if (curr.expiredAt < now) {
        await fastify.db
          .delete(refreshTokensTable)
          .where(eq(refreshTokensTable.id, curr.id));
        continue;
      }

      const isTokenFound = await bcrypt.compare(refreshToken, curr.tokenHash);
      if (isTokenFound) {
        validRefreshToken = curr;
        break;
      }
    }

    if (!validRefreshToken) {
      return handleError(reply, 401, "INVALID_TOKEN", "Token is invalid.");
    }

    const { accessToken } = generateTokens(fastify, payload.userId);
    return reply.code(200).send({
      ok: true,
      data: {
        accessToken: accessToken,
      },
    });
  };
