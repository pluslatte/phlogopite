<script lang="ts">
	import { ResizablePane } from '@/components/ui/resizable';
	import ResizableHandle from '@/components/ui/resizable/resizable-handle.svelte';
	import ResizablePaneGroup from '@/components/ui/resizable/resizable-pane-group.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import ToggleGroupItem from '@/components/ui/toggle-group/toggle-group-item.svelte';
	import ToggleGroup from '@/components/ui/toggle-group/toggle-group.svelte';

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
			<div class="flex h-full items-center justify-center p-6">
				<div class="min-h-60 mb-2 flex flex-col">
					<textarea
						bind:value={newPost}
						placeholder="Type something..."
						class="h-40 border-4 border-neutral-600 bg-neutral-600 text-white rounded-t-md"
					></textarea>
					<button onclick={addPost} class="h-10 bg-neutral-700 text-white rounded-b-md">
						Note
					</button>
				</div>
			</div>
		</ResizablePane>
		<ResizableHandle withHandle />
		<ResizablePane defaultSize={75}>
			<div class="flex h-full items-center justify-center p-6">
				<div class="flex flex-col">
					<div
						class="flex min-w-full justify-center gap-4 rounded-t-md bg-neutral-800/90 px-3 py-3 text-white"
					>
						<ToggleGroup type="single">
							<ToggleGroupItem class="bg-neutral-600" value="timeline home">H</ToggleGroupItem>
							<ToggleGroupItem class="bg-neutral-600" value="timeline local">L</ToggleGroupItem>
							<ToggleGroupItem class="bg-neutral-600" value="timeline social">S</ToggleGroupItem>
							<ToggleGroupItem class="bg-neutral-600" value="timeline global">G</ToggleGroupItem>
						</ToggleGroup>
					</div>
					<div>
						<ScrollArea class="bg-neutral-800/90 text-white">
							{#each notes as note}
								<div>{note}</div>
								<div role="separator" class="my-2 h-px w-full bg-neutral-500"></div>
							{/each}
						</ScrollArea>
					</div>
				</div>
			</div>
		</ResizablePane>
	</ResizablePaneGroup>
</div>
