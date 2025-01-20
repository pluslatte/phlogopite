<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import { onMount } from 'svelte';

	import MisskeyNotes from './misskey-notes.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';

	let {
		cookies,
		timelineType
	}: {
		cookies: PhlogopiteCookies;
		timelineType: string;
	} = $props();

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + cookies.server,
		credential: cookies.token
	});

	class TimelineFeed {
		notes: Note[] = $state([]);
		timelineType: string;
		stream: Stream;

		constructor(timelineType: string) {
			this.timelineType = timelineType;
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
			this.stream = new Stream(`https://${cookies.server}`, { token: cookies.token });
		}

		add_note(note: Note): void {
			if (this.notes.length > 32) {
				this.notes.pop();
			}
			this.notes.unshift(note);
		}

		init(): void {
			const LIMIT: number = 20;
			switch (timelineType) {
				case 'timelineHome':
					cli.request('notes/timeline', { limit: LIMIT }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					const channelHomeTimeline = this.stream.useChannel('homeTimeline');
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
					const channelHybridTimeline = this.stream.useChannel('hybridTimeline');
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
					const channelLocalTimeline = this.stream.useChannel('localTimeline');
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
					const channelGlobalTimeline = this.stream.useChannel('globalTimeline');
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
