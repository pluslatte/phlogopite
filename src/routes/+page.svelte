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

	import { toggleMode } from 'mode-watcher';

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
		<ResizablePane defaultSize={25} class="flex flex-col">
			<form onsubmit={addPost} class="m-4">
				<div class="grid gap-4">
					<Textarea bind:value={newPost} placeholder="Type something..." class="h-40 border"
					></Textarea>
					<Button type="submit">Note</Button>
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
			<div class="flex flex-row gap-2 m-4">
				<IconBell />
				<p class="grow">Notification</p>
				<button>
					<IconSettings />
				</button>
			</div>
			<ScrollArea type="auto" class="grow m-4 mt-0">
				{#each notes as note}
					<div>{note}</div>
				{/each}
			</ScrollArea>
		</ResizablePane>
		<ResizableHandle withHandle />
		<ResizablePane defaultSize={75} class="flex flex-col">
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
				<form>
					<div class="relative">
						<IconSearch
							class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
						/>
						<Input placeholder="Search" class="pl-8" />
					</div>
				</form>
			</div>
			<Separator />
			<ScrollArea type="auto" class="p-4 grow">
				{#each notes as note}
					<div>{note}</div>
				{/each}
			</ScrollArea>
		</ResizablePane>
	</ResizablePaneGroup>
</div>
