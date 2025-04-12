import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA()
	],
	optimizeDeps: {
		// You need me!
		// https://github.com/wobsoriano/svelte-sonner/issues/38#issuecomment-2422136477
		include: ['svelte-sonner']
	},
	define: {
		__DEV__: process.env.NODE_ENV !== 'production'
	}
});
