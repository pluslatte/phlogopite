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

<div>
	{#each nodes as node}
		{#if node.type == 'text'}
			<span class="whitespace-pre-wrap break-all">{node.props.text}</span>
		{:else if node.type == 'unicodeEmoji'}
			<span>{node.props.emoji}</span>
		{:else if node.type == 'emojiCode'}
			<span>{'emoji:' + node.props.name}</span>
		{:else}
			<span>{node.type}</span>
		{/if}
	{/each}
</div>
