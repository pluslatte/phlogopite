import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		// You need me!
		// https://github.com/wobsoriano/svelte-sonner/issues/38#issuecomment-2422136477
		include: ['svelte-sonner']
	}
});
