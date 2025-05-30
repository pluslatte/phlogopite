<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import ToggleGroupItem from '@/components/ui/toggle-group/toggle-group-item.svelte';
	import ToggleGroup from '@/components/ui/toggle-group/toggle-group.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';

	import IconHouse from 'lucide-svelte/icons/house';
	import IconHousePlus from 'lucide-svelte/icons/house-plus';
	import IconServer from 'lucide-svelte/icons/server';
	import IconGlobe from 'lucide-svelte/icons/globe';
	import IconPaperclip from 'lucide-svelte/icons/paperclip';
	import IconClipboardList from 'lucide-svelte/icons/clipboard-list';

	import { useSidebar } from '@/components/ui/sidebar';
	import { onMount } from 'svelte';
	import type { IResponse } from 'misskey-js/entities.js';
	import TimelineFeed from '@/components/timeline-feed.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import MisskeyClipNotes from '@/components/misskey-clip-notes.svelte';
	import MisskeyListNotes from '@/components/misskey-list-notes.svelte';
	import { getApiClientContext } from '@/api-client-context';

	let {
		data
	}: {
		data: {
			cookies: PhlogopiteCookies;
		};
	} = $props();

	let self: IResponse | null = $state(null);
	let timelineSelector = $state('timelineGlobal');

	const sidebar = useSidebar();
	const misskeyApiClient = getApiClientContext();
	onMount(() => {
		misskeyApiClient.request('i', {}).then((got) => {
			self = got;
		});
	});
</script>

<div class="relative flex h-full flex-col">
	<Button
		class="absolute left-0 m-2 flex flex-row items-center gap-4 rounded-lg border"
		size="icon"
		variant="ghost"
		onclick={sidebar.toggle}
	>
		<Avatar class="size-8 rounded-md">
			<AvatarImage src={self?.avatarUrl} alt={'@' + self?.username} />
			<AvatarFallback>...</AvatarFallback>
		</Avatar>
	</Button>
	<div class="flex flex-row justify-center">
		<ToggleGroup type="single" bind:value={timelineSelector} class="p-2">
			<ToggleGroupItem value="timelineHome">
				<IconHouse />
			</ToggleGroupItem>
			<ToggleGroupItem value="timelineSocial">
				<IconHousePlus />
			</ToggleGroupItem>
			<ToggleGroupItem value="timelineLocal">
				<IconServer />
			</ToggleGroupItem>
			<ToggleGroupItem value="timelineGlobal">
				<IconGlobe />
			</ToggleGroupItem>
			<Separator orientation="vertical" />
			<ToggleGroupItem value="clip">
				<IconPaperclip />
			</ToggleGroupItem>
			<ToggleGroupItem value="list">
				<IconClipboardList />
			</ToggleGroupItem>
			<!-- <Separator orientation="vertical" />
			<ToggleGroupItem value="search">
				<IconSearch />
			</ToggleGroupItem> -->
		</ToggleGroup>
	</div>
	<Separator />
	{#key timelineSelector}
		{#if timelineSelector == 'clip'}
			<MisskeyClipNotes />
		{:else if timelineSelector == 'list'}
			<MisskeyListNotes />
		{:else}
			<TimelineFeed cookies={data.cookies} timelineType={timelineSelector} />
		{/if}
	{/key}
</div>
