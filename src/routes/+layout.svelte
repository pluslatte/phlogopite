<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import SidebarProvider from '@/components/ui/sidebar/sidebar-provider.svelte';
	import AppSidebar from '@/components/app-sidebar.svelte';

	let { children } = $props();
</script>

<SidebarProvider style="--sidebar-width: 22rem; --sidebar-width-mobile: 22rem;">
	<AppSidebar />
	<main class="w-screen h-screen">
		{@render children?.()}
	</main>
</SidebarProvider>
<ModeWatcher />
