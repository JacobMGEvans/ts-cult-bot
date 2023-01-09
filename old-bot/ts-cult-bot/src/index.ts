import { Hono } from "hono";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";

type Env = {
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
};
const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  verifyKeyMiddleware(c.env.DISCORD_PUBLIC_KEY);
  await next();
});

/**
 * A simple :wave: hello page to verify the worker is working.
 */
app.get("/", ({ env }) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

app.post("/", async (c) => {
  const message = await c.req.json();
  if (message.type === InteractionType.PING) {
    console.log(JSON.stringify(message, null, 2));
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    console.log("Handling Ping request");
    return c.json({
      type: JSON.stringify(InteractionResponseType.PONG),
    });
  }

  return c.text(JSON.stringify(message, null, 2));
});

export default app;
