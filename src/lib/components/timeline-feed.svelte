<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import { onMount } from 'svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';

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
		isChannelUp: boolean;

		constructor(timelineType: string) {
			this.timelineType = timelineType;
			this.isChannelUp = false;
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
			this.stream = new Stream(`https://${cookies.server}`, { token: cookies.token });
			console.log('constructor: TimelineFeed');
		}

		resetStream(reason: string): void {
			this.closeStream(reason);
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
			this.openStream(new Stream(`https://${cookies.server}`, { token: cookies.token }), 'reset');
		}

		closeStream(reason: string): void {
			this.stream.close();
			this.setIsChannelUp(false, 'closeStream');
			console.log(`websocket connection intentionally closed (reason: ${reason})`);
		}

		openStream(stream: Stream, reason: string): void {
			this.stream = stream;
			console.log(`websocket connection intentionally opened (reason: ${reason})`);
		}

		setIsChannelUp(value: boolean, reason: string): void {
			if (this.isChannelUp == value) return;
			this.isChannelUp = value;
			console.log(`channel is ${value ? 'up' : 'down'} (reason: ${reason})`);
		}

		add_note(note: Note): void {
			if (this.notes.length > 32) {
				this.notes.pop();
			}
			this.notes.unshift(note);
		}

		initFeedAndSetChannel(): void {
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
			this.setIsChannelUp(true, 'init TimelineFeed');
		}
	}
	const timelineFeed = new TimelineFeed(timelineType);

	onMount(() => {
		timelineFeed.initFeedAndSetChannel();
		return () => {
			timelineFeed.closeStream('component destroyed');
		};
	});

	function onscroll() {
		if (timelineFeed.isChannelUp) {
			timelineFeed.resetStream('timelineFeed has been scrolled');
		}
	}
</script>

<ScrollArea type="auto" class="flex-grow p-4" {onscroll}>
	<MisskeyNotes notes={timelineFeed.notes} />
</ScrollArea>
