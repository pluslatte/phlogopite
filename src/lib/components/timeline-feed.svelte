<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import { onMount } from 'svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';

	import MisskeyNotes from './misskey-notes.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';

	import IconArrowUpToLine from 'lucide-svelte/icons/arrow-up-to-line';
	import Button from './ui/button/button.svelte';
	import type { Connection } from 'misskey-js/streaming.js';
	import { getApiClientContext } from '@/api-client-context';

	let {
		cookies,
		timelineType
	}: {
		cookies: PhlogopiteCookies;
		timelineType: string;
	} = $props();

	const misskeyApiClient = getApiClientContext();
	class TimelineFeed {
		notes: Note[] = $state([]);
		stream: Stream;
		doAutoUpdateFeed: boolean = $state(false);

		constructor() {
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
			this.stream = new Stream(`https://${cookies.server}`, { token: cookies.token });
		}

		add_note(note: Note): void {
			if (this.notes.length > 40) {
				this.notes.pop();
			}
			this.notes.unshift(note);
		}

		// Clear timeline feed, and get latest notes from specified timeline channel.
		initFeed(): void {
			this.notes = [];
			const LIMIT: number = 30;

			const addNotesToFeedAndSubscribe = (notes: Note[]) => {
				notes.forEach((note) => {
					this.notes.push(note);
					this.stream.send('subNote', { id: note.id });
					this.doAutoUpdateFeed = true;
				});
			};

			switch (timelineType) {
				case 'timelineHome':
					misskeyApiClient
						.request('notes/timeline', { limit: LIMIT })
						.then(addNotesToFeedAndSubscribe);
					break;
				case 'timelineSocial':
					misskeyApiClient
						.request('notes/hybrid-timeline', { limit: LIMIT })
						.then(addNotesToFeedAndSubscribe);
					break;
				case 'timelineLocal':
					misskeyApiClient
						.request('notes/local-timeline', { limit: LIMIT })
						.then(addNotesToFeedAndSubscribe);
					break;
				case 'timelineGlobal':
					misskeyApiClient
						.request('notes/global-timeline', { limit: LIMIT })
						.then(addNotesToFeedAndSubscribe);
					break;
				default:
					return;
			}
		}

		// subscribe timeline channel through websocket connection.
		setChannel(): void {
			let channelTimeline: Connection<{
				params: {
					withRenotes?: boolean;
					withFiles?: boolean;
				};
				events: {
					note: (payload: Note) => void;
				};
				receives: null;
			}>;
			switch (timelineType) {
				case 'timelineHome':
					channelTimeline = this.stream.useChannel('homeTimeline');
					break;
				case 'timelineSocial':
					channelTimeline = this.stream.useChannel('hybridTimeline');
					break;
				case 'timelineLocal':
					channelTimeline = this.stream.useChannel('localTimeline');
					break;
				case 'timelineGlobal':
					channelTimeline = this.stream.useChannel('globalTimeline');
					break;
				default:
					return;
			}
			channelTimeline.on('note', (note) => {
				if (this.doAutoUpdateFeed) {
					timelineFeed.add_note(note);
					// https://misskey-hub.net/ja/docs/for-developers/api/streaming/#%E6%8A%95%E7%A8%BF%E3%81%AE%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3
					this.stream.send('subNote', { id: note.id });
				}
			});
			this.stream.on('noteUpdated', (update) => {
				if (update.type == 'reacted' || update.type == 'unreacted') {
					misskeyApiClient.request('notes/show', { noteId: update.id }).then((got) => {
						for (let i = 0; i < this.notes.length; i++) {
							if (this.notes[i].id == update.id) {
								this.notes[i] = got;
							}
						}
					});
				}
			});
			console.log(`channel is up: ${timelineType}`);
		}
	}
	const timelineFeed = new TimelineFeed();

	onMount(() => {
		timelineFeed.initFeed();
		timelineFeed.setChannel();
		return () => {
			timelineFeed.stream.close();
		};
	});

	function onscroll() {
		if (timelineFeed.doAutoUpdateFeed) {
			timelineFeed.doAutoUpdateFeed = false;
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
		}
	}
</script>

{#if !timelineFeed.doAutoUpdateFeed}
	<div class="relative">
		<Button
			class="absolute left-1/2 top-2 z-10 h-8 w-12"
			size="icon"
			variant="secondary"
			onclick={() => {
				timelineFeed.initFeed();
				console.log('going up');
			}}
		>
			<IconArrowUpToLine />
		</Button>
	</div>
{/if}
<ScrollArea type="auto" class="flex-grow pl-2 pr-4 pt-2" {onscroll}>
	<MisskeyNotes notes={timelineFeed.notes} />
</ScrollArea>
