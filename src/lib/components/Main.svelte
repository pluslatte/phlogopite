<script lang="ts">
	import Timeline from './Timeline.svelte';

	let { notes }: { notes: string[] } = $props();
</script>

<div class="flex shrink grow flex-col min-w-[40rem] max-w-[60rem] m-2 ml-1">
	<p>huga</p>
	<Timeline {notes} />
</div>
