<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { api as misskeyApi } from 'misskey-js';
	import * as mfm from 'mfm-js';

	const { rawText }: { rawText: string | null } = $props();
	let nodes: mfm.MfmNode[] = $state([]);
	let cli: misskeyApi.APIClient = getContext<{ cli: misskeyApi.APIClient }>('client').cli;

	async function getEmojiUrl(emojiCode: string): Promise<string> {
		let got = await cli.request('emoji', { name: emojiCode });
		return got.url;
	}

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
			{#await getEmojiUrl(node.props.name)}
				<span>...</span>
			{:then emojiUrl}
				<img src={emojiUrl} />
			{/await}
		{:else}
			<span>{node.type}</span>
		{/if}
	{/each}
</div>
