import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig, presetAttributify, presetUno, presetIcons, presetWebFonts } from 'unocss';

export default defineConfig({
	shortcuts: {
		'btn-accent':
			'bg-accent text-white disabled:text-neutral border border-accent-light text-base rounded-lg p-4 shadow-md hover:bg-accent-light transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-300',
		'card-primary': 'font-space-mono px-2 rounded bg-#101010 border border-#202020',
		'card-green': 'font-space-mono px-2 rounded bg-#008000 border border-#00a000',
		'digit':
			'text-center text-[length:clamp(1rem,clamp(1rem,6vw,5vh),8rem)] w-[calc(1ch+1.25rem)] font-space-mono px-2 rounded bg-#008000 border border-#00a000',
		'digit-input':
			'text-center text-[length:clamp(1rem,clamp(1rem,6vw,5vh),8rem)] w-[calc(1ch+1.25rem)] card-green outline-none focus-within:bg-#002000 focus-within:border-#00a000 placeholder-shown:bg-primary-300 placeholder-shown:border-primary-500 caret-transparent transition-all'
	},

	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons(),
		presetWebFonts({
			provider: 'google',
			fonts: {
				'space': 'Space Grotesk',
				'space-mono': 'Space Mono'
			}
		})
	],
	transformers: [transformerVariantGroup()],
	theme: {
		colors: {
			primary: {
				DEFAULT: '#000000',
				300: '#101010',
				500: '#202020'
			},
			accent: {
				DEFAULT: '#303030',
				light: '#404040'
			}
		}
	}
});
