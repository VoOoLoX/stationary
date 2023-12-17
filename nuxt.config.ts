// Config docs: https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	typescript: {
		shim: false
	},
	modules: ['@vueuse/nuxt', '@unocss/nuxt', '@formkit/nuxt', '@nuxtjs/supabase', '@nuxtjs/eslint-module'],
	devtools: { enabled: true },
	runtimeConfig: {
		public: {}
	},
	nitro: {
		preset: 'bun'
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
