import { Hono } from "hono";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";

type Env = {
  DISCORD_PUBLIC_KEY: string;
};
const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  verifyKeyMiddleware(c.env.DISCORD_PUBLIC_KEY);
  await next();
});

app.get("/", async (c) => {
  const message = await c.req.json();
  // console.log(JSON.stringify(message, null, 2));
  // if (message.type === InteractionType.PING) {
  //   // The `PING` message is used during the initial webhook handshake, and is
  //   // required to configure the webhook in the developer portal.
  //   console.log("Handling Ping request");
  //   return c.json({
  //     type: JSON.stringify(InteractionResponseType.PONG),
  //   });
  // }

  return c.json(message);
});

export default app;
