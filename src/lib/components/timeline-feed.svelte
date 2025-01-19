<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import { onMount } from 'svelte';

	import MisskeyNotes from './misskey-notes.svelte';

	let {
		cookies,
		timelineType
	}: {
		cookies: {
			server: string;
			token: string;
		};
		timelineType: string;
	} = $props();

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + cookies.server,
		credential: cookies.token
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
			if (!cookies.server || !cookies.token) return;
			const stream = new Stream(`https://${cookies.server}`, { token: cookies.token });
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

<MisskeyNotes notes={timelineFeed.notes} />
