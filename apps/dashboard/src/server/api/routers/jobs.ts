import { contextProps } from '@trpc/react-query/shared';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const jobsRouter = createTRPCRouter({
  getAllJobs: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.jobs.findMany({
      orderBy: {
        dateAdded: 'asc',
      },
      include: {
        user: true,
      },
    });
  }),
});
