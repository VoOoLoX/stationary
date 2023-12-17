<script setup lang="ts">
const leaderboard = await useLeaderboard();
const user = useSupabaseUser();
</script>
<template>
	<div
		flex
		flex-col
		gap-4
		card-primary
		h-full
		overflow-x-hidden
		overflow-y-auto
		p-8
		hide-scrollbar
		min-w-320px
		class="no-scrollbar"
	>
		<pre class="w-full card-primary text-[#808080]">Leaderboard</pre>

		<div class="overflow-x-auto text-[#00ff00]">
			<!-- Table -->
			<table class="min-w-full text-center text-sm whitespace-nowrap">
				<!-- Table head -->
				<thead class="uppercase tracking-wider border-b-2 border-accent border-t">
					<tr>
						<th
							scope="col"
							class="px-6 py-4 border-accent border-x"
						>
							User
						</th>
						<th
							scope="col"
							class="px-6 py-4 border-accent border-x"
						>
							Bits
						</th>
						<th
							scope="col"
							class="px-6 py-4 border-accent border-x"
						>
							Answers
						</th>
					</tr>
				</thead>

				<!-- Table body -->
				<tbody>
					<tr
						v-for="score in leaderboard"
						:key="score?.id"
						class="border-accent border-b"
						:class="user?.id === score?.id ? 'bg-primary' : ''"
					>
						<th
							scope="row"
							class="px-6 py-4 border-accent border-x max-w-[32px] truncate"
						>
							<img
								:src="`https://api.dicebear.com/7.x/shapes/svg?size=64&seed=${score?.id}`"
								rounded-full
								style="filter: sepia(100%) brightness(85%) hue-rotate(65deg) saturate(365%) contrast(80%)"
							/>
							{{ score?.username }}
						</th>
						<td class="px-6 py-4 border-accent border-x">{{ score?.coins }}</td>
						<td class="px-6 py-4 border-accent border-x">{{ score?.answers_count ?? 0 }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
