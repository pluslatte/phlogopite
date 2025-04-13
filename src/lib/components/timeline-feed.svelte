<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import { Stream } from 'misskey-js';
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

	let loadingMore: boolean = $state(false);

	const misskeyApiClient = getApiClientContext();
	class TimelineFeed {
		notes: Note[] = $state([]);
		stream: Stream;
		doAutoUpdateFeed: boolean = $state(false);
		initLoad: boolean = false;

		constructor() {
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
			this.stream = new Stream(`https://${cookies.server}`, { token: cookies.token });
		}

		// Add note on top of the feed.
		add_note(note: Note): void {
			if (this.notes.length > 20) {
				console.log('pop');
				this.stream.send('unsubNote', { id: this.notes[this.notes.length - 1].id });
				this.notes.pop();
			}
			this.notes.unshift(note);
			this.stream.send('subNote', { id: note.id });
		}

		// Add note to the end of the feed.
		add_note_end(note: Note): void {
			if (this.notes.length > 20) {
				console.log('pop');
				this.stream.send('unsubNote', { id: this.notes[0].id });
				this.notes.shift();
			}
			this.notes.push(note);
			this.stream.send('subNote', { id: note.id });
		}

		// Clear the timeline feed.
		initFeed(): void {
			this.notes = [];
			this.initLoad = true;
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

		loadMore(): void {
			console.log('loadMore?');
			if (loadingMore) {
				console.log('cancel');
				return;
			}
			console.log('loadMore');
			loadingMore = true;

			const LIMIT: number = 12;
			const lastNoteId: string | null = this.notes[this.notes.length - 1]?.id;
			const addMoreNotesToFeed = (notes: Note[]) => {
				notes.shift();
				notes.forEach((note) => {
					this.add_note_end(note);
				});
				loadingMore = false;
			};
			const addInitialNotesToFeed = (notes: Note[]) => {
				notes.forEach((note) => {
					this.add_note_end(note);
				});
				loadingMore = false;
				if (this.initLoad) {
					this.doAutoUpdateFeed = true;
					this.initLoad = false;
				}
			};

			switch (timelineType) {
				case 'timelineHome':
					misskeyApiClient
						.request('notes/timeline', {
							limit: LIMIT,
							untilId: lastNoteId
						})
						.then(lastNoteId ? addMoreNotesToFeed : addInitialNotesToFeed);
					break;
				case 'timelineSocial':
					misskeyApiClient
						.request('notes/hybrid-timeline', {
							limit: LIMIT,
							untilId: lastNoteId
						})
						.then(lastNoteId ? addMoreNotesToFeed : addInitialNotesToFeed);
					break;
				case 'timelineLocal':
					misskeyApiClient
						.request('notes/local-timeline', {
							limit: LIMIT,
							untilId: lastNoteId
						})
						.then(lastNoteId ? addMoreNotesToFeed : addInitialNotesToFeed);
					break;
				case 'timelineGlobal':
					misskeyApiClient
						.request('notes/global-timeline', {
							limit: LIMIT,
							untilId: lastNoteId
						})
						.then(lastNoteId ? addMoreNotesToFeed : addInitialNotesToFeed);
					break;
				default:
					console.error('invalid timelineType');
					return;
			}
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

	function onScroll() {
		if (timelineFeed.doAutoUpdateFeed) {
			timelineFeed.doAutoUpdateFeed = false;
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
		}
	}

	function setupObserver(node: HTMLElement): { destroy: () => void } {
		const observer = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]) => {
				if (entries[0].isIntersecting) {
					timelineFeed.loadMore();
				}
			},
			{
				root: null,
				rootMargin: '100px',
				threshold: 1.0
			}
		);

		observer.observe(node);

		return {
			destroy() {
				observer.unobserve(node);
			}
		};
	}

	let sentinel: HTMLDivElement;
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
<ScrollArea type="auto" class="flex-grow pl-2 pr-4 pt-2" onscroll={onScroll}>
	<MisskeyNotes notes={timelineFeed.notes} />
	<div bind:this={sentinel} use:setupObserver style="height: 1px;">...</div>
	{#if loadingMore}
		<p>{'Loading...'}</p>
	{/if}
</ScrollArea>
