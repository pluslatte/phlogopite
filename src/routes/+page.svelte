<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { ResizablePane } from '@/components/ui/resizable';
	import ResizableHandle from '@/components/ui/resizable/resizable-handle.svelte';
	import ResizablePaneGroup from '@/components/ui/resizable/resizable-pane-group.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import ToggleGroupItem from '@/components/ui/toggle-group/toggle-group-item.svelte';
	import ToggleGroup from '@/components/ui/toggle-group/toggle-group.svelte';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import House from 'lucide-svelte/icons/house';
	import HousePlus from 'lucide-svelte/icons/house-plus';
	import Server from 'lucide-svelte/icons/server';
	import Globe from 'lucide-svelte/icons/globe';

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
	<ResizablePaneGroup direction="horizontal" class="h-full max-w-[80rem] rounded-lg border">
		<ResizablePane defaultSize={25}>
			<div class="p-2">
				<form onsubmit={addPost}>
					<div class="grid gap-2">
						<Textarea bind:value={newPost} placeholder="Type something..." class="h-40 border"
						></Textarea>
						<Button type="submit">Note</Button>
					</div>
				</form>
				<Button onclick={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</ResizablePane>
		<ResizableHandle withHandle />
		<ResizablePane defaultSize={75}>
			<div class="">
				<ToggleGroup type="single">
					<ToggleGroupItem value="timeline home">
						<House />
					</ToggleGroupItem>
					<ToggleGroupItem value="timeline social">
						<HousePlus />
					</ToggleGroupItem>
					<ToggleGroupItem value="timeline local">
						<Server />
					</ToggleGroupItem>
					<ToggleGroupItem value="timeline global">
						<Globe />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div>
				<ScrollArea>
					{#each notes as note}
						<div>{note}</div>
						<div role="separator" class="my-2 h-px w-full bg-neutral-500"></div>
					{/each}
				</ScrollArea>
			</div>
		</ResizablePane>
	</ResizablePaneGroup>
</div>
