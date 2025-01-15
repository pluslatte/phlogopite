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

	import IconSun from 'lucide-svelte/icons/sun';
	import IconMoon from 'lucide-svelte/icons/moon';
	import IconHouse from 'lucide-svelte/icons/house';
	import IconHousePlus from 'lucide-svelte/icons/house-plus';
	import IconServer from 'lucide-svelte/icons/server';
	import IconGlobe from 'lucide-svelte/icons/globe';
	import IconBell from 'lucide-svelte/icons/bell';
	import IconSettings from 'lucide-svelte/icons/settings';
	import IconPaperclip from 'lucide-svelte/icons/paperclip';
	import IconSearch from 'lucide-svelte/icons/search';
	import IconClipboardList from 'lucide-svelte/icons/clipboard-list';
	import IconReply from 'lucide-svelte/icons/reply';
	import IconRepeat2 from 'lucide-svelte/icons/repeat-2';
	import IconSmilePlus from 'lucide-svelte/icons/smile-plus';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';
	import IconSend from 'lucide-svelte/icons/send';
	import IconRocket from 'lucide-svelte/icons/rocket';

	import { toggleMode } from 'mode-watcher';

	import { onMount } from 'svelte';

	let windowWidth = $state(0);
	function updateWindowSize() {
		windowWidth = window.innerWidth;
	}
	onMount(() => {
		updateWindowSize();
		window.addEventListener('resize', updateWindowSize);
		return () => {
			window.removeEventListener('resize', updateWindowSize);
		};
	});

	let notes = $state(['Hello, Misskey', 'Hello, SvelteKit']);
	let newPost = $state('');

	function addPost() {
		if (newPost.trim()) {
			notes.push(newPost);
		}
	}
</script>

<div class="flex p-2 h-full w-full justify-center">
	<ResizablePaneGroup direction="horizontal" class="max-w-[80rem] rounded-lg border">
		<!-- {#if windowWidth > 768} -->
		<ResizablePane defaultSize={30} class="flex flex-col">
			<form onsubmit={addPost} class="m-4">
				<div class="grid gap-4">
					<div class="flex flex-row">
						<Avatar class="rounded-lg">
							<AvatarImage
								src="https://media.virtualkemomimi.net/files/d55bc44c-46b5-4f92-80fd-c8a66ab0b4b5.png"
								alt="@pluslatte"
							/>
							<AvatarFallback>...</AvatarFallback>
						</Avatar>
						<div class="flex-frow grid grid-flow-row ml-2 text-sm">
							<span class="font-bold">Username</span>
							<span class="text-muted-foreground overflow-hidden"
								>@id@long_long_looong_server_name</span
							>
						</div>
						<Button variant="outline" size="icon" class="rounded-r-none border-r-0 shrink-0">
							<IconGlobe />
						</Button>
						<Separator orientation="vertical" />
						<Button variant="outline" size="icon" class="rounded-l-none border-l-0 shrink-0">
							<IconRocket />
						</Button>
						<Separator orientation="vertical" class="mx-4" />
						<Button type="submit" size="icon" class="shrink-0">
							<IconSend class="h-4 w-4" />
						</Button>
					</div>
					<Textarea bind:value={newPost} placeholder="Type something..." class="h-40 border"
					></Textarea>
				</div>
			</form>
			<Button onclick={toggleMode} variant="outline" size="icon">
				<IconSun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<IconMoon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<Separator />
			<div class="flex flex-row items-center gap-2 ml-4 mr-4 mt-2 mb-2">
				<IconBell class="h-4 w-4" />
				<p class="flex-grow">Notification</p>
				<Button variant="ghost" size="icon" class="rounded-full">
					<IconSettings class="h-4 w-4" />
				</Button>
			</div>
			<ScrollArea type="auto" class="flex-grow m-4 mt-0">
				{#each notes as note}
					<div>{note}</div>
				{/each}
			</ScrollArea>
		</ResizablePane>
		<ResizableHandle withHandle />
		<!-- {/if} -->
		<ResizablePane defaultSize={70} class="flex flex-col">
			<div class="flex flex-row justify-center">
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
		</ResizablePane>
	</ResizablePaneGroup>
</div>
