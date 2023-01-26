import { signIn, signOut, useSession } from 'next-auth/react';

export const Authbutton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={
          sessionData
            ? () => void signOut({ callbackUrl: '/' })
            : () => void signIn('discord', { callbackUrl: '/dashboard' })
        }
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};
