<script lang="ts">
	import TimeLine from './TimeLine.svelte';

	let { notes }: { notes: string[] } = $props();
</script>

<div class="flex shrink grow flex-col min-w-[40rem] max-w-[60rem]">
	<p>TimeLine</p>
	<TimeLine {notes} />
</div>
