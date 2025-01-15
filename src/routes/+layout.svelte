<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import SidebarProvider from '@/components/ui/sidebar/sidebar-provider.svelte';
	import AppSidebar from '@/components/app-sidebar.svelte';

	let { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />
	<main class="w-screen h-screen">
		{@render children?.()}
	</main>
</SidebarProvider>
<ModeWatcher />
