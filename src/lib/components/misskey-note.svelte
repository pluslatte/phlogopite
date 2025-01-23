<script lang="ts">
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';

	import type { Note } from 'misskey-js/entities.js';
	import { formatDistanceStrict, parseISO } from 'date-fns';
	import AvatarFallBackAnim from './avatar-fall-back-anim.svelte';
	import MfmTextRenderer from './mfm-text-renderer.svelte';
	import * as mfm from 'mfm-js';
	import PhlogopiteUserLink from './phlogopite-user-link.svelte';
	import { getContext, onMount } from 'svelte';
	import { api as misskeyApi } from 'misskey-js';
	import { toast } from 'svelte-sonner';

	let cli: misskeyApi.APIClient = getContext<{ cli: misskeyApi.APIClient }>('client').cli;
	if (!cli) {
		console.error('no misskeyApiClient found');
	}

	let {
		note,
		hideQuoteExistenceIndicator,
		withReply
	}: {
		note: Note;
		hideQuoteExistenceIndicator?: boolean;
		withReply?: boolean;
	} = $props();

	let timeStampAutoRefreshHash: number = $state(Math.random());

	function GetTimestampFromISO8601(iso_string: string): string {
		const gotDate = parseISO(iso_string);
		const currentDate = new Date();
		return formatDistanceStrict(currentDate, gotDate, { addSuffix: true });
	}

	async function getLocalEmojiData(emojiCode: string): Promise<{ url: string; alt: string }> {
		let got = await cli.request('emoji', { name: emojiCode });
		return { url: got.url, alt: got.name };
	}

	function createReaction(noteId: string, reactionName: string): void {
		cli
			.request('notes/reactions/create', { noteId, reaction: reactionName })
			.then(() => {
				toast.success('Successfully created a reaction.');
			})
			.catch((error) => {
				toast.error(`Reaction creation failed: ${error}`);
			});
	}

	function deleteReaction(noteId: string): void {
		cli
			.request('notes/reactions/delete', { noteId })
			.then(() => {
				toast.success('Successfully removed a reaction.');
			})
			.catch((error) => {
				toast.error(`Reaction removement failed: ${error}`);
			});
	}

	onMount(() => {
		const interval = setInterval(() => {
			timeStampAutoRefreshHash = Math.random();
		}, 3000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

{#snippet prime(noteToRender: Note)}
	<div class="flex flex-row items-start text-sm">
		<PhlogopiteUserLink
			username={noteToRender.user.username}
			host={noteToRender.user.host ? noteToRender.user.host : ''}
		>
			<Avatar class="ml-2 mt-1 rounded-lg">
				<AvatarImage src={noteToRender.user.avatarUrl} alt={'@' + noteToRender.user.username} />
				<AvatarFallBackAnim />
			</Avatar>
		</PhlogopiteUserLink>
		<div class="ml-2 grid flex-grow">
			<div class="flex w-full flex-row items-center overflow-hidden">
				{#if noteToRender.user.name}
					<PhlogopiteUserLink
						username={noteToRender.user.username}
						host={noteToRender.user.host ? noteToRender.user.host : ''}
					>
						<div class="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
							<MfmTextRenderer
								mfmNodes={mfm.parse(noteToRender.user.name)}
								assets={{ host: noteToRender.user.host, emojis: noteToRender.user.emojis }}
							/>
						</div>
					</PhlogopiteUserLink>
				{/if}
				<div class="overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
					{'@' +
						noteToRender.user.username +
						(noteToRender.user.host ? '@' + noteToRender.user.host : '')}
				</div>
				<div class="w-4"></div>
				{#key timeStampAutoRefreshHash}
					<div class="ml-auto whitespace-nowrap text-muted-foreground">
						{GetTimestampFromISO8601(noteToRender.createdAt)}
					</div>
				{/key}
			</div>
			<!-- main text -->
			<!-- https://qiita.com/ist-a-k/items/2b1385574e1a1babdde1 -->
			{#if noteToRender.text}
				<div class="min-w-0 whitespace-pre-wrap text-wrap" style="word-break: break-word;">
					<MfmTextRenderer
						mfmNodes={mfm.parse(noteToRender.text)}
						assets={{ host: noteToRender.user.host, emojis: noteToRender.emojis }}
					/>
					{#if noteToRender.renote && !hideQuoteExistenceIndicator}
						<div class="text-muted-foreground">...quote...</div>
					{/if}
				</div>
			{/if}
			<!-- image -->
			{#if noteToRender.files}
				<div class="flex flex-row flex-wrap">
					{#each noteToRender.files as file}
						<img
							src={file.thumbnailUrl}
							alt={file.name}
							class="m-2 max-w-64 rounded-lg object-cover"
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	<!-- reactions -->
	{#if noteToRender.reactions}
		<div class="flex flex-row">
			<div class="w-14"></div>
			<div>
				{#each Object.entries(noteToRender.reactions) as [key, value]}
					{#if !key.split('@')[1]}
						<span>{`${key}`}</span>
					{:else if noteToRender.reactionEmojis[key.slice(1, -1)]}
						<img
							src={noteToRender.reactionEmojis[key.slice(1, -1)]}
							alt={key}
							class="inline-block h-5 align-middle"
						/>
					{:else}
						{#await getLocalEmojiData(key.split('@')[0].slice(1))}
							...
						{:then { url, alt }}
							<img src={url} {alt} class="inline-block h-5 align-middle" />
						{/await}
					{/if}
					<span>{`[${value}]`}</span>
				{/each}
			</div>
		</div>
	{/if}
{/snippet}

{#if note.reply && withReply}
	<div class="flex flex-row px-2 pb-2">
		<div class="w-8"></div>
		<div class="flex-grow">
			<div class="rounded-md border-2 bg-secondary bg-opacity-50 p-2 opacity-80">
				{@render prime(note.reply)}
			</div>
		</div>
	</div>
{/if}
{@render prime(note)}
