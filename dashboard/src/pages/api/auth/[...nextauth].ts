import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { env } from '../../../env/server.mjs';
import { prisma } from '../../../server/db';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async redirect({ url, baseUrl }) {
      // allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // disallow redirects to other origins
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
