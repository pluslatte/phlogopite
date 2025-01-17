<script lang="ts">
	import { onMount } from 'svelte';
	import * as mfm from 'mfm-js';

	const { rawText }: { rawText: string | null } = $props();
	let nodes: mfm.MfmNode[] = $state([]);

	onMount(() => {
		if (!rawText) return;
		nodes = mfm.parse(rawText);
	});
</script>

{#each nodes as node}
	{#if node.type == 'text'}
		<span>{node.props.text}</span>
	{:else if node.type == 'emojiCode'}
		<span>{node.props.name}</span>
	{/if}
{/each}
