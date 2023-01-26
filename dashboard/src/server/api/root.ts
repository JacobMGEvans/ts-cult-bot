import { createTRPCRouter } from './trpc';
import { exampleRouter } from './routers/example';
import { userRouter } from './routers/users';
import { warningsRouter } from './routers/warnings';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  users: userRouter,
  warnings: warningsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
