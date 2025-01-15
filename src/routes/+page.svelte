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
	import IconArrowRightFromLine from 'lucide-svelte/icons/arrow-right-from-line';
	import IconArrowLeftFromLine from 'lucide-svelte/icons/arrow-left-from-line';

	import { useSidebar } from '@/components/ui/sidebar';

	const sidebar = useSidebar();

	let notes = $state(['Hello, Misskey', 'Hello, SvelteKit']);
</script>

<div class="flex flex-col rounded-lg h-full">
	<div class="flex flex-row relative justify-center">
		<Button
			class="absolute left-0 border rounded-lg flex flex-row items-center m-2"
			size="icon"
			variant="ghost"
			onclick={sidebar.toggle}
		>
			<Avatar class="rounded-md size-8">
				<AvatarImage
					src="https://media.virtualkemomimi.net/files/d55bc44c-46b5-4f92-80fd-c8a66ab0b4b5.png"
					alt="@pluslatte"
				/>
				<AvatarFallback>...</AvatarFallback>
			</Avatar>
			{#if sidebar.open}
				<IconArrowLeftFromLine />
			{:else}
				<IconArrowRightFromLine />
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
		{#each notes as note}
			<div class="flex flex-row items-start gap-1 text-sm">
				<Avatar class="rounded-lg mt-1">
					<AvatarImage
						src="https://media.virtualkemomimi.net/files/d55bc44c-46b5-4f92-80fd-c8a66ab0b4b5.png"
						alt="@pluslatte"
					/>
					<AvatarFallback>...</AvatarFallback>
				</Avatar>
				<div class="flex-grow grid grid-flow-row gap-1 ml-2">
					<div class="flex flex-row items-center gap-2">
						<span class="font-bold">Username</span>
						<span class="text-muted-foreground">@id@server</span>
						<span class="flex-grow"></span>
						<span class="text-muted-foreground">Time</span>
					</div>
					<p style="white-space: pre-wrap;">{note}</p>
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
