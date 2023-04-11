import { contextProps } from '@trpc/react-query/shared';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const warningsRouter = createTRPCRouter({
  getAllWarnings: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.warnings.findMany({
      orderBy: {
        dateAdded: 'asc',
      },
      include: {
        user: true,
      },
    });
  }),
  getAdminName: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
