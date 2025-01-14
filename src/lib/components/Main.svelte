<script lang="ts">
	import TimeLine from './TimeLine.svelte';

	let { notes }: { notes: string[] } = $props();
</script>

<div class="flex shrink grow flex-col min-w-[40rem] max-w-[60rem] m-2 ml-1">
	<p>huga</p>
	<TimeLine {notes} />
</div>
