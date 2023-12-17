// Config docs: https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	typescript: {
		shim: false
	},
	modules: ['@vueuse/nuxt', '@unocss/nuxt', '@formkit/nuxt', '@nuxtjs/supabase', '@nuxtjs/eslint-module'],
	devtools: { enabled: true },
	app: {
		head: {
			title: 'Stationary - Typing game',

			meta: [{ name: 'description', content: 'Simple typing game' }],
			link: [
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'manifest', href: '/site.webmanifest' }
			]
		}
	},
	runtimeConfig: {
		public: {
			URL: process.env.URL ?? ''
		}
	},
	devServer: {
		host: '0.0.0.0',
		port: 7337
	},
	// #region CONFIGS
	supabase: {},
	eslint: {
		lintOnStart: false
	}
	// #endregion
});
