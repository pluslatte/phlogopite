<script lang="ts">
	import Separator from '@/components/ui/separator/separator.svelte';

	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import { onMount } from 'svelte';

	let { data, timelineType }: { data: any; timelineType: string } = $props();

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + data.server,
		credential: data.token
	});

	class TimelineFeed {
		notes: Note[] = $state([]);
		timelineType: string;

		constructor(timelineType: string) {
			this.timelineType = timelineType;
		}

		add_note(note: Note): void {
			if (this.notes.length > 32) {
				this.notes.pop();
			}
			this.notes.unshift(note);
		}

		init(): void {
			if (!data.server || !data.token) return;
			const stream = new Stream(`https://${data.server}`, { token: data.token });
			switch (timelineType) {
				case 'timelineHome':
					cli.request('notes/timeline', { limit: 10 }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					const channelHomeTimeline = stream.useChannel('homeTimeline');
					channelHomeTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
					});
					break;
				case 'timelineSocial':
					cli.request('notes/hybrid-timeline', { limit: 10 }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					const channelHybridTimeline = stream.useChannel('hybridTimeline');
					channelHybridTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
					});
					break;
				case 'timelineLocal':
					cli.request('notes/local-timeline', { limit: 10 }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					const channelLocalTimeline = stream.useChannel('localTimeline');
					channelLocalTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
					});
					break;
				case 'timelineGlobal':
					cli.request('notes/global-timeline', { limit: 10 }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					const channelGlobalTimeline = stream.useChannel('globalTimeline');
					channelGlobalTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
					});
					break;
				default:
					return;
			}
		}
	}
	const timelineFeed = new TimelineFeed(timelineType);

	onMount(() => {
		timelineFeed.init();
	});
</script>

{#each timelineFeed.notes as note (note.id)}
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
