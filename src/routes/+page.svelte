<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import ToggleGroupItem from '@/components/ui/toggle-group/toggle-group-item.svelte';
	import ToggleGroup from '@/components/ui/toggle-group/toggle-group.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';

	import IconHouse from 'lucide-svelte/icons/house';
	import IconHousePlus from 'lucide-svelte/icons/house-plus';
	import IconServer from 'lucide-svelte/icons/server';
	import IconGlobe from 'lucide-svelte/icons/globe';
	import IconPaperclip from 'lucide-svelte/icons/paperclip';
	import IconSearch from 'lucide-svelte/icons/search';
	import IconClipboardList from 'lucide-svelte/icons/clipboard-list';
	import IconArrowLeftFromLine from 'lucide-svelte/icons/arrow-left-from-line';

	import { useSidebar } from '@/components/ui/sidebar';
	import { onMount } from 'svelte';
	import { api as misskeyApi } from 'misskey-js';
	import type { IResponse } from 'misskey-js/entities.js';
	import TimelineFeed from '@/components/timeline-feed.svelte';

	let { data } = $props();
	let self: IResponse | null = $state(null);

	const sidebar = useSidebar();
	const cli = new misskeyApi.APIClient({
		origin: 'https://' + data.server,
		credential: data.token
	});

	onMount(() => {
		if (!data.server || !data.token) return;

		cli.request('i', {}).then((got) => {
			self = got;
		});
	});
</script>

<div class="flex h-full flex-col rounded-lg">
	<div class="relative flex flex-row justify-center">
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
		<ToggleGroup type="single" class="p-2">
			<ToggleGroupItem value="timeline home">
				<IconHouse />
			</ToggleGroupItem>
			<ToggleGroupItem value="timeline social">
				<IconHousePlus />
			</ToggleGroupItem>
			<ToggleGroupItem value="timeline local">
				<IconServer />
			</ToggleGroupItem>
			<ToggleGroupItem value="timeline global">
				<IconGlobe />
			</ToggleGroupItem>
			<Separator orientation="vertical" />
			<ToggleGroupItem value="clip">
				<IconPaperclip />
			</ToggleGroupItem>
			<ToggleGroupItem value="list">
				<IconClipboardList />
			</ToggleGroupItem>
			<Separator orientation="vertical" />
		</ToggleGroup>
		<form class="p-2">
			<div class="relative">
				<IconSearch
					class="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground"
				/>
				<Input placeholder="Search" class="pl-8" />
			</div>
		</form>
	</div>
	<Separator />
	<ScrollArea type="auto" class="flex-grow p-4">
		<TimelineFeed {data} />
	</ScrollArea>
</div>
