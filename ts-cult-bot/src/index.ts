import Fastify from "fastify";
import * as dotenv from "dotenv";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Pretty sure this is for middleware
await fastify.register(
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY as string)
);

/**
 * A simple :wave: hello page to verify the worker is working.
 */
fastify.get("/", async (_, reply) => {
  return reply.send(`👋 ${process.env.DISCORD_APPLICATION_ID as string}`);
});

fastify.post("/", async (request, reply) => {
  const message = (await request.body) as Record<string, InteractionType>;
  if (message.type === InteractionType.PING) {
    console.log(JSON.stringify(message, null, 2));
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    console.log("Handling Ping request");
    return reply.send({
      type: JSON.stringify(InteractionResponseType.PONG),
    });
  }

  return reply.send(JSON.stringify(message, null, 2));
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();
