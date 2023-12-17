<script>
import '@unocss/reset/tailwind-compat.css';
</script>

<template>
	<NuxtPage />
</template>

<style>
.no-scrollbar::-webkit-scrollbar {
	display: none;
}

.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
