<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import SidebarProvider from '@/components/ui/sidebar/sidebar-provider.svelte';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { api as misskeyApi } from 'misskey-js';
	import { setApiClientContext } from '@/api-client-context';
	import { pwaInfo } from 'virtual:pwa-info';

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let {
		children,
		data
	}: {
		children: Snippet<[]>;
		data: {
			cookies: PhlogopiteCookies;
		};
	} = $props();

	let misskeyApiClient = new misskeyApi.APIClient({
		origin: 'https://' + data.cookies.server,
		credential: data.cookies.token
	});
	setApiClientContext(misskeyApiClient);
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>
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
