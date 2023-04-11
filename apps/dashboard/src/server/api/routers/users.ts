import { contextProps } from '@trpc/react-query/shared';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure
    //  .input(z.object({ text: z.string() }))
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          role: true,
        },
      });
    }),
});
