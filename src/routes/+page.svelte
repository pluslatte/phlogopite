<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { ResizablePane } from '@/components/ui/resizable';
	import ResizableHandle from '@/components/ui/resizable/resizable-handle.svelte';
	import ResizablePaneGroup from '@/components/ui/resizable/resizable-pane-group.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
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
	import IconSettings from 'lucide-svelte/icons/settings';
	import IconPaperclip from 'lucide-svelte/icons/paperclip';
	import IconSearch from 'lucide-svelte/icons/search';
	import IconClipboardList from 'lucide-svelte/icons/clipboard-list';
	import IconReply from 'lucide-svelte/icons/reply';
	import IconRepeat2 from 'lucide-svelte/icons/repeat-2';
	import IconSmilePlus from 'lucide-svelte/icons/smile-plus';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';
	import IconArrowLeftFromLine from 'lucide-svelte/icons/arrow-left-from-line';

	import { useSidebar } from '@/components/ui/sidebar';
	import { onMount } from 'svelte';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import type { Note } from 'misskey-js/entities.js';

	let { data } = $props();

	const sidebar = useSidebar();
	const cli = new misskeyApi.APIClient({
		origin: 'https://' + data.server,
		credential: data.token
	});

	class TimelineFeed {
		notes: Note[] = $state([]);

		add_note(note: Note): void {
			if (this.notes.length > 32) {
				this.notes.pop();
			}
			this.notes.unshift(note);
		}

		init(): void {
			cli.request('notes/global-timeline', { limit: 10 }).then((got) => {
				got.forEach((note) => {
					this.notes.unshift(note);
				});
			});
		}
	}

	const timelineFeed = new TimelineFeed();

	onMount(() => {
		if (!data.server || !data.token) return;
		const stream = new Stream(`https://${data.server}`, { token: data.token });
		const channelGlobalTimeline = stream.useChannel('globalTimeline');
		timelineFeed.init();
		channelGlobalTimeline.on('note', (note) => {
			timelineFeed.add_note(note);
		});
	});
</script>

<div class="flex flex-col rounded-lg h-full">
	<div class="flex flex-row relative justify-center">
		<Button
			class="absolute left-0 border rounded-lg flex flex-row items-center m-2 gap-4"
			size="icon"
			variant="ghost"
			onclick={sidebar.toggle}
		>
			{#if sidebar.open}
				<IconArrowLeftFromLine />
			{:else}
				<Avatar class="rounded-md size-8">
					<AvatarImage
						src="https://media.virtualkemomimi.net/files/d55bc44c-46b5-4f92-80fd-c8a66ab0b4b5.png"
						alt="@pluslatte"
					/>
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
					class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
				/>
				<Input placeholder="Search" class="pl-8" />
			</div>
		</form>
	</div>
	<Separator />
	<ScrollArea type="auto" class="p-4 flex-grow">
		{#each timelineFeed.notes as note}
			<div class="flex flex-row items-start gap-1 text-sm">
				<Avatar class="h-4 w-4">
					{#if note.user.host}
						<AvatarImage src={'http://www.google.com/s2/favicons?domain=' + note.user.host} />
					{:else}
						<AvatarImage src={'http://www.google.com/s2/favicons?domain=' + data.server} />
					{/if}
					<AvatarFallback>...</AvatarFallback>
				</Avatar>
				<Avatar class="rounded-lg mt-1">
					<AvatarImage src={note.user.avatarUrl} alt={'@' + note.user.username} />
					<AvatarFallback>...</AvatarFallback>
				</Avatar>
				<div class="flex-grow flex flex-col gap-1 ml-2">
					<div class="flex flex-row items-center gap-2">
						<span class="font-bold">{note.user.name}</span>
						<span class="text-muted-foreground">
							{'@' + note.user.username + (note.user.host ? '@' + note.user.host : '')}
						</span>
						<span class="flex-grow"></span>
						<span class="text-muted-foreground">{note.createdAt}</span>
					</div>
					<!-- ながい文を表示すると画面があふれる -->
					<!-- <p style="white-space: pre-wrap;">{note}</p> -->
					<!-- これで直ったが、どうして？ -->
					<p style="white-space: pre-wrap; word-break: break-word;">
						{note.text}
					</p>
				</div>
			</div>
			<div class="flex flex-row p-2 gap-8">
				<Button variant="ghost" size="icon" class="rounded-full">
					<IconReply class="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" class="rounded-full">
					<IconRepeat2 class="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" class="rounded-full">
					<IconSmilePlus class="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" class="rounded-full">
					<IconEllipsis class="h-4 w-4" />
				</Button>
			</div>
			<Separator class="mb-4" />
		{/each}
	</ScrollArea>
</div>
