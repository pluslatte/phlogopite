<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import SidebarProvider from '@/components/ui/sidebar/sidebar-provider.svelte';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let {
		children,
		data
	}: {
		children: Snippet<[]>;
		data: {
			cookies: PhlogopiteCookies;
		};
	} = $props();
</script>

<Toaster />
<SidebarProvider
	style="--sidebar-width: 22rem; --sidebar-width-mobile: 22rem;"
	class="flex h-screen w-screen flex-row"
>
	{#if page.url.pathname !== '/auth' && page.url.pathname !== '/auth/callback'}
		<AppSidebar cookies={data.cookies} />
	{/if}
	<main class="flex-grow">
		{@render children?.()}
	</main>
</SidebarProvider>
<ModeWatcher />
