<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import SidebarProvider from '@/components/ui/sidebar/sidebar-provider.svelte';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let {
		children,
		data
	}: {
		children: Snippet<[]>;
		data: {
			cookies: {
				server: string;
				token: string;
			};
		};
	} = $props();
</script>

<SidebarProvider
	style="--sidebar-width: 22rem; --sidebar-width-mobile: 22rem;"
	class="flex h-screen w-screen flex-row"
>
	{#if page.url.pathname !== '/auth'}
		<AppSidebar cookies={data.cookies} />
	{/if}
	<main class="flex-grow">
		{@render children?.()}
	</main>
</SidebarProvider>
<ModeWatcher />
