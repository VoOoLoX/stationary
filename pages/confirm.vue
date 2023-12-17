<script setup lang="ts">
const user = useSupabaseUser();
watch(
	user,
	() => {
		if (user.value) {
			return navigateTo('/');
		}
	},
	{ immediate: true }
);
</script>
<template>
	<main
		grid
		w-screen
		h-screen
		bg-primary
		of-hidden
	>
		<p>Loading...</p>
	</main>
</template>
