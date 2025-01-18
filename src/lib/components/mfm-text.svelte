<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { api as misskeyApi } from 'misskey-js';
	import * as mfm from 'mfm-js';
	import { codeToHtml } from 'shiki';

	const {
		mfmNodes,
		assets
	}: {
		mfmNodes: mfm.MfmNode[];
		assets: {
			host: string | null;
			emojis?: { [key: string]: string | undefined };
		};
	} = $props();

	let cli: misskeyApi.APIClient = getContext<{ cli: misskeyApi.APIClient }>('client').cli;

	async function getEmojiData(
		emojiCode: string,
		host: string | null
	): Promise<{ url: string; alt: string }> {
		if (assets.emojis) {
			let url = assets.emojis[emojiCode];
			if (url) {
				return { url: url, alt: emojiCode };
			}
		}
		if (!host) {
			// if host is local
			let got = await cli.request('emoji', { name: emojiCode });
			return { url: got.url, alt: got.name };
		} else {
			// if host is remote
			let got = await fetch(`https://${host}/api/emoji?name=${emojiCode}`, {
				method: 'GET'
			});
			let json: { url: string; name: string } = await got.json();
			return { url: json.url, alt: json.name };
		}
	}

	function validateTime(time: string | boolean | null | undefined) {
		if (time == null) {
			return null;
		}

		if (typeof time === 'boolean') {
			return null;
		}

		return time.match(/^\-?[0-9.]+s$/) ? time : null;
	}
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

<!-- strike -->
{#snippet strike(node: mfm.MfmStrike)}
	{@const childNodes = mfm.parse(mfm.toString(node.children))}
	{#each childNodes as childNode}
		<del>
			{@render prime(childNode)}
		</del>
	{/each}
{/snippet}

<!-- italic -->
{#snippet italic(node: mfm.MfmItalic)}
	{@const childNodes = mfm.parse(mfm.toString(node.children))}
	{#each childNodes as childNode}
		<span class="italic">
			{@render prime(childNode)}
		</span>
	{/each}
{/snippet}

{#snippet small(node: mfm.MfmSmall)}
	{@const childNodes = mfm.parse(mfm.toString(node.children))}
	{#each childNodes as childNode}
		<span class="text-sm opacity-70">
			{@render prime(childNode)}
		</span>
	{/each}
{/snippet}

<!-- center -->
{#snippet center(node: mfm.MfmCenter)}
	{@const childNodes = mfm.parse(mfm.toString(node.children))}
	{#each childNodes as childNode}
		<div class="text-center">
			{@render prime(childNode)}
		</div>
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

<!-- block code -->
{#snippet blockCode(node: mfm.MfmCodeBlock)}
	{#if node.props.lang}
		<div class="relative mb-2 mt-2">
			{#await codeToHtml(node.props.code, { lang: node.props.lang, theme: 'github-dark-dimmed' })}
				<span>{`[code...(lang=${node.props.lang})]`}</span>
			{:then html}
				{@html html.replace(/<pre class="/, '<pre class="p-4 rounded ')}
				<button
					onclick={() => {
						navigator.clipboard
							.writeText(node.props.code)
							.then(() => {
								console.log('copied the code');
							})
							.catch((err) => {
								console.error('failed to copy: ', err);
							});
					}}
					class="absolute right-3 top-2 rounded-sm px-1 text-muted-foreground hover:bg-muted-foreground hover:bg-opacity-25"
				>
					{node.props.lang}
				</button>
			{/await}
		</div>
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
	{:catch}
		<span>{':' + node.props.name + ':'}</span>
	{/await}
{/snippet}

<!-- main -->
{#snippet prime(node: mfm.MfmNode)}
	{#if node.type == 'text'}
		<span>{node.props.text}</span>
	{:else if node.type == 'bold'}
		{@render bold(node)}
	{:else if node.type == 'strike'}
		{@render strike(node)}
	{:else if node.type == 'italic'}
		{@render italic(node)}
	{:else if node.type == 'small'}
		{@render small(node)}
	{:else if node.type == 'center'}
		{@render center(node)}
	{:else if node.type == 'url'}
		<a href={node.props.url} class="border-b text-muted-foreground">{node.props.url}</a>
	{:else if node.type == 'link' && node.children}
		{@render link(node)}
	{:else if node.type == 'mention'}
		<span class="text-muted-foreground">{node.props.acct}</span>
	{:else if node.type == 'hashtag'}
		<span class="text-blue-500">{'#' + node.props.hashtag}</span>
	{:else if node.type == 'blockCode'}
		{@render blockCode(node)}
	{:else if node.type == 'inlineCode'}
		<span class="rounded-sm bg-muted-foreground bg-opacity-20 px-1 font-mono">
			{node.props.code}
		</span>
	{:else if node.type == 'emojiCode'}
		{@render customEmoji(node, assets.host)}
	{:else if node.type == 'unicodeEmoji'}
		<span>{node.props.emoji}</span>
	{:else}
		<span>{'![' + node.type + ']'}</span>
	{/if}
{/snippet}

{#each mfmNodes as node}
	{@render prime(node)}
{/each}
