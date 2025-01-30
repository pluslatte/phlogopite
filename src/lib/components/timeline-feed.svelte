<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import { onMount } from 'svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';

	import MisskeyNotes from './misskey-notes.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';

	import IconArrowUpToLine from 'lucide-svelte/icons/arrow-up-to-line';
	import Button from './ui/button/button.svelte';
	import { toast } from 'svelte-sonner';

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
		stream: Stream;
		doAutoUpdateOfFeed: boolean = $state(false);

		constructor() {
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

		// Clear timeline feed, and get latest notes from specified timeline channel.
		initFeed(): void {
			this.notes = [];
			const LIMIT: number = 20;

			switch (timelineType) {
				case 'timelineHome':
					cli.request('notes/timeline', { limit: LIMIT }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					break;
				case 'timelineSocial':
					cli.request('notes/hybrid-timeline', { limit: LIMIT }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					break;
				case 'timelineLocal':
					cli.request('notes/local-timeline', { limit: LIMIT }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
						});
					});
					break;
				case 'timelineGlobal':
					cli.request('notes/global-timeline', { limit: LIMIT }).then((got) => {
						got.forEach((note) => {
							this.notes.push(note);
							this.stream.send('subNote', { id: note.id });
						});
					});
					break;
				default:
					return;
			}
		}

		// subscribe timeline channel through websocket connection.
		setChannel(): void {
			switch (timelineType) {
				case 'timelineHome':
					const channelHomeTimeline = this.stream.useChannel('homeTimeline');
					channelHomeTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
					});
					break;
				case 'timelineSocial':
					const channelHybridTimeline = this.stream.useChannel('hybridTimeline');
					channelHybridTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
					});
					break;
				case 'timelineLocal':
					const channelLocalTimeline = this.stream.useChannel('localTimeline');
					channelLocalTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
					});
					break;
				case 'timelineGlobal':
					const channelGlobalTimeline = this.stream.useChannel('globalTimeline');
					channelGlobalTimeline.on('note', (note) => {
						timelineFeed.add_note(note);
						// https://misskey-hub.net/ja/docs/for-developers/api/streaming/#%E6%8A%95%E7%A8%BF%E3%81%AE%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3
						this.stream.send('subNote', { id: note.id });
					});
					this.stream.on('noteUpdated', (update) => {
						toast.info(`update! ${update.type}`);
					});
					break;
				default:
					return;
			}
			this.doAutoUpdateOfFeed = true;
			console.log(`channel is up: ${timelineType}`);
		}
	}
	const timelineFeed = new TimelineFeed();

	onMount(() => {
		timelineFeed.initFeed();
		return () => {
			timelineFeed.stream.close();
		};
	});

	function onscroll() {
		if (timelineFeed.doAutoUpdateOfFeed) {
			timelineFeed.doAutoUpdateOfFeed = false;
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
		}
	}
</script>

{#if !timelineFeed.doAutoUpdateOfFeed}
	<div class="relative">
		<Button
			class="absolute left-1/2 top-2 z-10 h-8 w-12"
			size="icon"
			variant="secondary"
			onclick={() => {
				timelineFeed.initFeed();
				timelineFeed.setChannel();
				console.log('going up');
			}}
		>
			<IconArrowUpToLine />
		</Button>
	</div>
{/if}
<ScrollArea type="auto" class="flex-grow pt-2" {onscroll}>
	<MisskeyNotes notes={timelineFeed.notes} />
</ScrollArea>
