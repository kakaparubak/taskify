import { fastify, type FastifyInstance, type FastifyReply } from "fastify";
import * as bcrypt from "bcrypt";
import { refreshTokens } from "../../db/schema/refreshTokens";
import { eq } from "drizzle-orm";

export const generateTokens = (fastify: FastifyInstance, userId: string) => {
  const accessToken = fastify.jwt.sign({ userId }, { expiresIn: "15m" });
  const refreshToken = fastify.jwt.sign({ userId }, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const setRefreshCookies = (reply: FastifyReply, refreshToken: string) => {
  reply.setCookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth/refresh",
    maxAge: 604800,
  });
};

export const storeRefreshToken = async (
  fastify: FastifyInstance,
  userId: string,
  refreshToken: string,
) => {
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  const expiredAt = new Date(Date.now());
  expiredAt.setDate(expiredAt.getDate() + 7);

  const data = {
    tokenHash, userId, expiredAt
  }

  await fastify.db.insert(refreshTokens).values(data)
};
