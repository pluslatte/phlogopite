<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { api as misskeyApi } from 'misskey-js';
	import * as mfm from 'mfm-js';

	const { rawText, host }: { rawText: string | null; host: string | null } = $props();
	let nodes: mfm.MfmNode[] = $state([]);
	let cli: misskeyApi.APIClient = getContext<{ cli: misskeyApi.APIClient }>('client').cli;

	async function getEmojiData(
		emojiCode: string,
		host: string | null
	): Promise<{ url: string; alt: string }> {
		if (!host) {
			let got = await cli.request('emoji', { name: emojiCode });
			return { url: got.url, alt: got.name };
		} else {
			let got = await fetch(`https://${host}/api/emoji?name=${emojiCode}`, {
				method: 'GET'
			});
			let json: { url: string; name: string } = await got.json();
			return { url: json.url, alt: json.name };
		}
	}

	onMount(() => {
		if (!rawText) return;
		nodes = mfm.parse(rawText);
	});
</script>

<!-- bold -->
{#snippet bold(node: mfm.MfmBold)}
	{@const childNodes = mfm.parse(mfm.toString(node.children))}
	{#each childNodes as childNode}
		<span class="font-bold">
			{@render prime(childNode)}
		</span>
	{/each}
{/snippet}

<!-- link -->
{#snippet link(node: mfm.MfmLink)}
	{@const childNodeFirst = mfm.parseSimple(mfm.toString(node.children))[0]}
	{#if childNodeFirst.type == 'text'}
		<a href={node.props.url} class="border-b text-muted-foreground">
			{childNodeFirst.props.text}
		</a>
	{/if}
{/snippet}

<!-- custom emoji -->
{#snippet customEmoji(node: mfm.MfmEmojiCode, host: string | null)}
	{#await getEmojiData(node.props.name, host)}
		<span>...</span>
	{:then emojiData}
		<span class="inline-block">
			<img src={emojiData.url} alt={emojiData.alt} class="h-5 align-middle" />
		</span>
	{/await}
{/snippet}

<!-- main -->
{#snippet prime(node: mfm.MfmNode)}
	{#if node.type == 'text'}
		<span>{node.props.text}</span>
	{:else if node.type == 'bold'}
		{@render bold(node)}
	{:else if node.type == 'unicodeEmoji'}
		<span>{node.props.emoji}</span>
	{:else if node.type == 'emojiCode'}
		{@render customEmoji(node, host)}
	{:else if node.type == 'url'}
		<a href={node.props.url} class="border-b text-muted-foreground">{node.props.url}</a>
	{:else if node.type == 'link' && node.children}
		{@render link(node)}
	{:else}
		<span>{'![' + node.type + ']'}</span>
	{/if}
{/snippet}

{#each nodes as node}
	{@render prime(node)}
{/each}
