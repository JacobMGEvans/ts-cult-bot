import { useSession } from 'next-auth/react';

// wrapper around useSession
// - since gSSP checks for user auth on protect pages, the session always exists
// - TypeScript doesn't understand this and flags 'session' as possibly undefined
// - this prevents that without having to do checks on all protected pages
export const useHydratedSession = () => {
	const { data: session } = useSession();
	if (!session || !session.user)
		throw new Error('Only use this when you hydrated session via gSSP');

	return {
		...session,
		user: { ...session.user, id: session.user.id!, name: session.user.name! },
	};
};