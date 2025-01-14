<script lang="ts">
	import TimelineToolbar from './TimelineToolbar.svelte';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';

	let { notes }: { notes: string[] } = $props();
</script>

<div class="flex flex-col">
	<TimelineToolbar />
	<div>
		<ScrollArea class="bg-neutral-800/90 text-white">
			{#each notes as note}
				<div>{note}</div>
				<div role="separator" class="my-2 h-px w-full bg-neutral-500"></div>
			{/each}
		</ScrollArea>
	</div>
</div>
