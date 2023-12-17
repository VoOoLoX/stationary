<script setup lang="ts">
import { getNode } from '@formkit/core';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const result = ref<{ success: boolean; message: string } | null>(null);

const submitForm = () => {
	getNode('loginForm')?.submit();
};

const login = async (value: { email: string }) => {
	const { error } = await supabase.auth.signInWithOtp({
		email: value.email,
		options: {
			emailRedirectTo: 'http://localhost:7337/confirm'
		}
	});

	if (error) {
		result.value = {
			success: false,
			message: 'Error sending email, please try again.'
		};
	} else {
		result.value = {
			success: true,
			message: 'Email sent, please check your inbox.'
		};
	}
};

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
		<div
			grid
			gap-4
			min-w-20rem
			p-8
			card-primary
			place-self-center
		>
			<h1
				place-self-center
				text="#00ff00"
				class="text-[length:clamp(1rem,clamp(1rem,3vw,5vh),6rem)]"
			>
				Stati0nary_
			</h1>
			<h3
				text-center
				text-white
				class="text-[length:clamp(0.5rem,clamp(0.5rem,3vw,5vh),2rem)]"
			>
				Login
			</h3>
			<hr border-primary-500 />
			<FormKit
				id="loginForm"
				type="form"
				messages-class="hidden"
				:actions="false"
				@submit="login"
			>
				<FormKit
					type="email"
					name="email"
					label="E-mail"
					validation="required|email"
					label-class="!bg-primary-300 text-white"
					input-class="w-full bg-primary-300 border border-accent-light rounded-lg px-2.5 py-2.5 text-white placeholder:text-neutral outline-none"
					message-class="text-xs mt-2 text-red-500"
					placeholder="john@example.com"
					:floating-label="true"
				/>
				<p
					v-if="result"
					text-xs
					mt-2
					:class="result.success ? 'text-green-500' : 'text-red-500'"
				>
					{{ result?.message }}
				</p>
			</FormKit>
			<button
				btn-accent
				place-self-center
				@click="submitForm"
			>
				<span
					flex
					items-center
					gap-2
				>
					<p i-material-symbols-mail />
					<p>Continue with Email</p>
				</span>
			</button>
		</div>
	</main>
</template>
