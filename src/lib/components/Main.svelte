<script lang="ts">
	import TimeLine from './TimeLine.svelte';

	let { notes }: { notes: string[] } = $props();
</script>

<div class="shrink grow h-full min-w-[40rem] max-w-[60rem]">
	<TimeLine {notes} />
</div>
