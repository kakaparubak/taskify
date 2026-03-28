import buildDb from "./db/db";
import buildServer from "./server";

const fastify = await buildServer();
export const db = buildDb()

async function main() {
  try {
    await fastify.listen({ port: 3002 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();