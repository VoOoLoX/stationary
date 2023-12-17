<script setup lang="ts">
import type { Database } from '~/types/supabase';

type Player = Database['public']['Tables']['players']['Row'];

const db = useSupabaseClient<Database>();
const user = useSupabaseUser();
const player = shallowRef<Partial<Player>>();
const inputLength = 8;

const getPlayerOrRegister = async () => {
	if (user.value) {
		const { data: existingPlayer } = await db
			.from('players')
			.select('id,coins,mouse,keyboard,display,ssd,motherboard,ram,cpu,gpu,prompt')
			.eq('id', user.value.id)
			.limit(1)
			.single();
		if (existingPlayer) {
			player.value = existingPlayer as Partial<Player>;
		} else {
			const { data: newPlayer } = await db
				.from('players')
				.insert({ id: user.value.id })
				.select('id,coins,mouse,keyboard,display,ssd,motherboard,ram,cpu,gpu,prompt')
				.limit(1)
				.single();
			player.value = newPlayer as Partial<Player>;
		}
	}
};

const input = ref<string[]>([]);
const inputRefs = ref<HTMLInputElement[]>([]);
const selectedInput = ref<number>(0);

const answer = computed(() => {
	return input.value.join('');
});

const submitAnswer = async () => {
	if (!player.value || !user.value?.id) {
		return;
	}

	await db.rpc('answer', {
		player_id: user.value.id,
		answer: answer.value
	});
};

const buyComponent = async (
	component: 'mouse' | 'keyboard' | 'display' | 'ssd' | 'motherboard' | 'ram' | 'cpu' | 'gpu'
) => {
	if (!player.value || !user.value?.id) {
		return;
	}

	await db.rpc('buy_component', {
		player_id: user.value.id,
		component_type: component
	});
};

const onInput = (event: Event, index: number) => {
	event.preventDefault();
	const value = (event.target as HTMLInputElement).value.toLowerCase();
	if (!/[a-z0-9]/.test(value)) {
		input.value[index] = '';
		return;
	}

	input.value[index] = value;
	if (index === inputLength - 1) {
		selectedInput.value++;
		return;
	}
	inputRefs.value[index + 1].focus();
};

onMounted(async () => {
	await getPlayerOrRegister();

	if (!player.value || !user.value?.id) {
		return;
	}

	db.channel(`updates`)
		.on(
			'postgres_changes',
			{ event: 'UPDATE', schema: 'public', table: 'players', filter: `id=eq.${player.value?.id}` },
			(payload) => {
				const updatedPlayer = payload.new as Omit<Player, 'answers' | 'registered_at'>;
				player.value = updatedPlayer;
				input.value = [];
				selectedInput.value = 0;
				inputRefs.value[selectedInput.value].focus();
			}
		)
		.subscribe();

	onStartTyping(() => {
		inputRefs.value.find((ref) => !ref.value)?.focus();
	});

	onKeyStroke('Backspace', () => {
		input.value[selectedInput.value] = '';
		selectedInput.value > 0 && selectedInput.value--;
		inputRefs.value[selectedInput.value].focus();
	});

	onKeyStroke('Enter', () => {
		if (answer.value !== player.value?.prompt) return;

		submitAnswer();
	});
});
</script>

<template>
	<div
		grid
		place-items-center
		font-space-mono
		text="#00ff00"
		select-none
	>
		<div
			flex
			flex-col
			items-center
			gap-4
		>
			<h1
				place-self-center
				class="text-[length:clamp(1rem,clamp(1rem,3vw,5vh),6rem)]"
			>
				Stati0nary_
			</h1>
			<div
				flex
				flex-col
				gap-4
			>
				<div
					flex
					flex-col
					items-center
					gap-2
				>
					<pre class="w-full card-primary text-[#808080]">Prompt</pre>
					<div
						flex
						gap-2
					>
						<template v-if="player?.prompt">
							<div
								v-for="(letter, index) in player?.prompt?.split('')"
								:key="index"
								digit
							>
								{{ letter }}
							</div>
						</template>
						<template v-else>
							<div
								v-for="index in inputLength"
								:key="index - 1"
								digit
							>
								0
							</div>
						</template>
					</div>
				</div>
				<div
					flex
					flex-col
					items-center
					gap-2
				>
					<pre class="w-full card-primary text-[#808080]">Input</pre>
					<div
						flex
						gap-2
					>
						<input
							v-for="index in inputLength"
							:key="index - 1"
							:ref="
								(element) => {
									inputRefs[index - 1] = element as HTMLInputElement;
								}
							"
							v-model="input[index - 1]"
							:autofocus="index - 1 === 0"
							placeholder=" "
							maxlength="1"
							pattern="[a-z0-9]"
							class="digit-input"
							@focus="selectedInput = index - 1"
							@input="
								(event) => {
									onInput(event, index - 1);
								}
							"
						/>
					</div>
				</div>
			</div>
			<div
				flex
				items-center
				gap-2
				py-2
				card-primary
			>
				<p class="text-[#808080]">Bit(s):</p>
				<p class="text-1.5rem/1.5rem i-bi-file-binary"></p>
				<p class="text-1.5rem/1.5rem">{{ player?.coins }}</p>
			</div>
			<!--  -->
			<div
				flex
				flex-wrap
				gap-2
				justify-center
				w-full
				min-w-320px
				max-w-452px
				class="w-[clamp(320px,100%,452px)]"
			>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-mouse
					></p>

					<p class="text-xs">{{ player?.mouse }} ({{ (player?.mouse ?? 0) * 1 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('mouse')"
					>
						Buy 0050
						<div i-bi-file-binary></div>
					</button>
				</div>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-keyboard
					></p>

					<p class="text-xs">{{ player?.keyboard }} ({{ (player?.keyboard ?? 0) * 2 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('keyboard')"
					>
						Buy 0098
						<div i-bi-file-binary></div>
					</button>
				</div>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-display
					></p>

					<p class="text-xs">{{ player?.display }} ({{ (player?.display ?? 0) * 4 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('display')"
					>
						Buy 0192
						<div i-bi-file-binary></div>
					</button>
				</div>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-device-ssd
					></p>

					<p class="text-xs">{{ player?.ssd }} ({{ (player?.ssd ?? 0) * 8 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('ssd')"
					>
						Buy 0376
						<div i-bi-file-binary></div>
					</button>
				</div>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-motherboard
					></p>

					<p class="text-xs">{{ player?.motherboard }} ({{ (player?.motherboard ?? 0) * 16 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('motherboard')"
					>
						Buy 0736
						<div i-bi-file-binary></div>
					</button>
				</div>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-memory
					></p>

					<p class="text-xs">{{ player?.ram }} ({{ (player?.ram ?? 0) * 32 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('ram')"
					>
						Buy 1440
						<div i-bi-file-binary></div>
					</button>
				</div>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-cpu
					></p>

					<p class="text-xs">{{ player?.cpu }} ({{ (player?.cpu ?? 0) * 64 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('cpu')"
					>
						Buy 2720
						<div i-bi-file-binary></div>
					</button>
				</div>
				<div
					grid
					place-items-center
					gap-2
					card-primary
					p-4
				>
					<p
						class="text-1.5rem"
						i-bi-gpu-card
					></p>

					<p class="text-xs">{{ player?.gpu }} ({{ (player?.gpu ?? 0) * 128 }})</p>
					<button
						flex
						items-center
						gap-2
						card-green
						hover:brightness-150
						@click="buyComponent('gpu')"
					>
						Buy 5120
						<div i-bi-file-binary></div>
					</button>
				</div>
			</div>
			<!--  -->
		</div>
	</div>
</template>
