<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import MisskeyUserPage from '@/components/misskey-user-page.svelte';
	import type { IResponse } from 'misskey-js/entities.js';
	import { useSidebar } from '@/components/ui/sidebar';
	import { onMount } from 'svelte';
	import { api as misskeyApi } from 'misskey-js';

	import IconArrowLeftFromLine from 'lucide-svelte/icons/arrow-left-from-line';

	// /user?username=<username>&host=<host>

	let {
		data
	}: {
		data: {
			cookies: PhlogopiteCookies;
			username: string;
			host?: string | null;
		};
	} = $props();
	let self: IResponse | null = $state(null);

	const sidebar = useSidebar();
	const cli = new misskeyApi.APIClient({
		origin: 'https://' + data.cookies.server,
		credential: data.cookies.token
	});

	onMount(() => {
		if (!data.cookies.server || !data.cookies.token) return;

		cli.request('i', {}).then((got) => {
			self = got;
		});
	});
</script>

<div class="relative flex h-full flex-col overflow-auto">
	<Button
		class="absolute left-0 m-2 flex flex-row items-center gap-4 rounded-lg border"
		size="icon"
		variant="ghost"
		onclick={sidebar.toggle}
	>
		{#if sidebar.open}
			<IconArrowLeftFromLine />
		{:else}
			<Avatar class="size-8 rounded-md">
				<AvatarImage src={self?.avatarUrl} alt={'@' + self?.username} />
				<AvatarFallback>...</AvatarFallback>
			</Avatar>
		{/if}
	</Button>
	<MisskeyUserPage cookies={data.cookies} username={data.username} host={data.host} />
</div>
