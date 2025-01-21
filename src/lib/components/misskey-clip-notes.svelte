<script lang="ts">
	import { api as misskeyApi } from 'misskey-js';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';
	import MisskeyNotes from './misskey-notes.svelte';
	import type { Note } from 'misskey-js/entities.js';

	let {
		cookies,
		clipId
	}: {
		cookies: PhlogopiteCookies;
		clipId: string;
	} = $props();

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + cookies.server,
		credential: cookies.token
	});
</script>

<ScrollArea type="auto" class="flex-grow p-4">
	{#await cli.request('clips/notes', { clipId })}
		Loading...
	{:then notes: Note[]}
		<MisskeyNotes {notes} />
	{/await}
</ScrollArea>
