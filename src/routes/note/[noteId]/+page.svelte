<script lang="ts">
	import { api as misskeyApi } from 'misskey-js';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';

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
</script>

{#await cli.request('notes/show', { noteId: data.noteId })}
	<span>
		{'Loading...'}
	</span>
{:then note}
	<span>
		{note.text}
	</span>
{/await}
