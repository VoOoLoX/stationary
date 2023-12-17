import type { Player } from '~/types/player';
import type { Database } from '~/types/supabase';

export const usePlayer = async (): Promise<Partial<Player> | undefined> => {
	const db = useSupabaseClient<Database>();
	const user = useSupabaseUser();

	if (user.value) {
		const { data: existingPlayer } = await db
			.from('players')
			.select('id,username,coins,mouse,keyboard,display,ssd,motherboard,ram,cpu,gpu,prompt')
			.eq('id', user.value.id)
			.limit(1)
			.single();

		if (existingPlayer) return existingPlayer as Partial<Player>;
		else {
			const { data: newPlayer } = await db
				.from('players')
				.insert({ id: user.value.id })
				.select('id,username,coins,mouse,keyboard,display,ssd,motherboard,ram,cpu,gpu,prompt')
				.limit(1)
				.single();

			return newPlayer as Partial<Player>;
		}
	}
};
