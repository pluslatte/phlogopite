<script lang="ts">
	import Separator from '@/components/ui/separator/separator.svelte';

	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import { onMount } from 'svelte';
	import MisskeyNoteActions from './misskey-note-actions.svelte';
	import MfmText from './mfm-text.svelte';
	import * as mfm from 'mfm-js';

	import Repeat_2 from 'lucide-svelte/icons/repeat-2';
	import MisskeyRenote from './misskey-renote.svelte';
	import MisskeyQuote from './misskey-quote.svelte';

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
			const LIMIT: number = 20;
			switch (timelineType) {
				case 'timelineHome':
					cli.request('notes/timeline', { limit: LIMIT }).then((got) => {
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
					cli.request('notes/hybrid-timeline', { limit: LIMIT }).then((got) => {
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
					cli.request('notes/local-timeline', { limit: LIMIT }).then((got) => {
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
					cli.request('notes/global-timeline', { limit: LIMIT }).then((got) => {
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
		<MisskeyRenote renotedBy={note.user} renote={note.renote} />
		<MisskeyNoteActions />
		<Separator class="mb-4" />
	{:else if note.renote && note.text}
		<MisskeyQuote quotedBy={note.user} {note} quote={note.renote} />
		<MisskeyNoteActions />
		<Separator class="mb-4" />
	{:else}
		<MisskeyNote {note} />
		<MisskeyNoteActions />
		<Separator class="mb-4" />
	{/if}
{/each}
