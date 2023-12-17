<script setup lang="ts">
import type { Player } from '~/types/player';
import type { Database } from '~/types/supabase';

const db = useSupabaseClient<Database>();
const user = useSupabaseUser();
const player = shallowRef<Partial<Player>>({});

const editUsername = ref(false);

const toggleUsernameEdit = async () => {
	if (!user.value) return;

	if (editUsername.value === true)
		await db.rpc('change_username', {
			player_id: user.value?.id,
			new_username: player.value.username ?? 'user'
		});
	editUsername.value = !editUsername.value;
};

const signOut = async () => {
	const { error } = await db.auth.signOut();
	if (error) {
		return;
	}

	navigateTo('/login', { replace: true });
};

onMounted(async () => {
	if (!user.value) {
		navigateTo('/login', { replace: true });
	}

	const playerData = await usePlayer();

	if (playerData) {
		player.value = playerData;
	}
});
</script>

<template>
	<main class="grid w-screen h-[100svh] bg-primary of-hidden">
		<div
			flex
			flex-col
			gap-4
			place-self-center
			card-primary
			p-4
		>
			<div
				flex
				items-center
				gap-4
			>
				<img
					:src="`https://api.dicebear.com/7.x/shapes/svg?size=64&seed=${user?.id}`"
					rounded-full
					style="filter: sepia(100%) brightness(85%) hue-rotate(65deg) saturate(365%) contrast(80%)"
				/>
				<div
					flex
					flex-col
					gap-1
				>
					<p class="text-[#808080] text-xs">Username:</p>
					<div
						flex
						items-center
						relative
					>
						<input
							ref="username"
							v-model="player.username"
							class="text-[#00a000] text-xl disabled:border-none border-b border-b-[#00a000] outline-none bg-transparent"
							:disabled="!editUsername"
						/>
						<button
							absolute
							right-0
							class="text-[#00a000]"
							:class="editUsername ? 'i-material-symbols-save' : 'i-material-symbols-edit'"
							@click="toggleUsernameEdit"
						></button>
					</div>
				</div>
			</div>
			<div
				flex
				gap-2
			>
				<NuxtLink
					to="/game"
					btn-accent
					place-self-center
					>Play</NuxtLink
				>
				<NuxtLink
					to="/leaderboard"
					btn-accent
					place-self-center
					>Leaderboard</NuxtLink
				>
				<button
					btn-accent
					place-self-center
					@click="signOut"
				>
					Log out
				</button>
			</div>
		</div>
	</main>
</template>
