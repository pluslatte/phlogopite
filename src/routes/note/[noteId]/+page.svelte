<script lang="ts">
	import { api as misskeyApi } from 'misskey-js';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import MisskeyRenote from '@/components/misskey-renote.svelte';
	import MisskeyNoteActions from '@/components/misskey-note-actions.svelte';
	import { Separator } from '@/components/ui/separator';
	import MisskeyQuote from '@/components/misskey-quote.svelte';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import { setContext } from 'svelte';

	let {
		data
	}: {
		data: {
			cookies: PhlogopiteCookies;
			noteId: string;
		};
	} = $props();

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + data.cookies.server,
		credential: data.cookies.token
	});
	if (!cli) {
		console.error('no misskeyApiClient found');
	}

	setContext('client', {
		cli
	});
</script>

{#await cli.request('notes/show', { noteId: data.noteId })}
	<span>
		{'Loading...'}
	</span>
{:then note}
	<div class="p-2 pr-4">
		{#if note.renote && !note.text}
			<MisskeyRenote renotedBy={note.user} renote={note.renote} />
			<MisskeyNoteActions note={note.renote} />
		{:else if note.renote && note.text}
			<MisskeyQuote
				quotedBy={note.user}
				{note}
				quote={note.renote}
				withReply={note.reply != null}
				withReplyOfQuote={note.renote.reply != null}
			/>
			<MisskeyNoteActions {note} />
		{:else}
			<MisskeyNote {note} withReply={note.reply != null} />
			<MisskeyNoteActions {note} />
		{/if}
	</div>
{:catch error}
	<span>{error}</span>
{/await}
