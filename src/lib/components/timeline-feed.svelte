<script lang="ts">
	import Separator from '@/components/ui/separator/separator.svelte';

	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + data.server,
		credential: data.token
	});

	class TimelineFeed {
		notes: Note[] = $state([]);

		add_note(note: Note): void {
			if (this.notes.length > 32) {
				this.notes.pop();
			}
			this.notes.unshift(note);
		}

		init(): void {
			cli.request('notes/global-timeline', { limit: 10 }).then((got) => {
				got.forEach((note) => {
					this.notes.unshift(note);
				});
			});
		}
	}
	const timelineFeed = new TimelineFeed();

	onMount(() => {
		if (!data.server || !data.token) return;
		const stream = new Stream(`https://${data.server}`, { token: data.token });
		const channelGlobalTimeline = stream.useChannel('globalTimeline');
		timelineFeed.init();
		channelGlobalTimeline.on('note', (note) => {
			timelineFeed.add_note(note);
		});
	});
</script>

{#each timelineFeed.notes as note}
	{#if note.renote && !note.text}
		<MisskeyNote note={note.renote} renotedBy={note.user} {data} />
	{:else if note.renote && note.text}
		<MisskeyNote {note} {data} />
		<MisskeyNote note={note.renote} quotedBy={note.user} {data} />
	{:else}
		<MisskeyNote {note} {data} />
	{/if}
	<Separator class="mb-4" />
{/each}
