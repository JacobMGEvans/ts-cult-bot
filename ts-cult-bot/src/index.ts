import { Hono } from "hono";

// never type to show that we don't have any Worker bindings yet
const app = new Hono<{ Bindings: never }>();

app.get("/", (c) => {
  return c.text(`Hello World. ${JSON.stringify(c, null, 2)})}`);
});

export default app;
