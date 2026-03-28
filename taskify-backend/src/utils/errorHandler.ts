import type { FastifyReply } from "fastify";

export const handleError = (
  reply: FastifyReply,
  httpcode: number,
  code: number | string,
  message: string,
) => {
  reply.code(httpcode).send({
    ok: false,
    error: {
      code,
      message
    }
  })

  return
};
