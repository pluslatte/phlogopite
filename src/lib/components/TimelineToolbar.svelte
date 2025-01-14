<script lang="ts">
	import { createToolbar, melt } from '@melt-ui/svelte';

	const {
		elements: { root, button, link, separator },
		builders: { createToolbarGroup }
	} = createToolbar();
	const {
		elements: { group: timelineGroup, item: timelineItem }
	} = createToolbarGroup();
</script>

<div
	use:melt={$root}
	class="flex min-w-full justify-center gap-4 rounded-t-md bg-neutral-800/90 px-3 py-3 text-white shadow-sm lg:w-[35rem]"
>
	<div class="flex gap-1" use:melt={$timelineGroup}>
		<button class="item" aria-label="timeline home" use:melt={$timelineItem}> H </button>
		<button class="item" aria-label="timeline local" use:melt={$timelineItem}> L </button>
		<button class="item" aria-label="timeline social" use:melt={$timelineItem}> S </button>
		<button class="item" aria-label="timeline global" use:melt={$timelineItem}> G </button>
	</div>
	<div class="separator w-px h-full bg-neutral-500" use:melt={$separator}></div>
</div>
