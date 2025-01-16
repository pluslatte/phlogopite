<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import SidebarProvider from '@/components/ui/sidebar/sidebar-provider.svelte';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
</script>

<SidebarProvider style="--sidebar-width: 22rem; --sidebar-width-mobile: 22rem;">
	{#if page.url.pathname !== '/auth'}
		<AppSidebar {data} />
	{/if}
	<main class="h-screen w-screen">
		{@render children?.()}
	</main>
</SidebarProvider>
<ModeWatcher />
