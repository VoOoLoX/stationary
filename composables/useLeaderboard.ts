import type { Leaderboard } from '~/types/leaderboard';
import type { Database } from '~/types/supabase';

export const useLeaderboard = async (): Promise<Partial<Leaderboard> | undefined> => {
	const db = useSupabaseClient<Database>();
	const user = useSupabaseUser();

	if (user.value) {
		const { data: leaderboard } = await db.rpc('leaderboard').select();

		if (leaderboard) return leaderboard as Partial<Leaderboard>;
	}
};
