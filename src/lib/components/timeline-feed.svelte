<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import { api as misskeyApi, Stream } from 'misskey-js';
	import { onMount } from 'svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';

	import MisskeyNotes from './misskey-notes.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';

	import IconArrowUpToLine from 'lucide-svelte/icons/arrow-up-to-line';
	import Button from './ui/button/button.svelte';

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

	let feedHash: number = $state(Math.random());

	class TimelineFeed {
		notes: Note[] = $state([]);
		stream: Stream;
		isChannelUp: boolean = $state(false);

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
						});
					});
					break;
				default:
					return;
			}
		}

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
					});
					break;
				default:
					return;
			}
			this.isChannelUp = true;
			console.log('channel is up');
			feedHash = Math.random();
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
		if (timelineFeed.isChannelUp) {
			timelineFeed.stream.close();
			timelineFeed.isChannelUp = false;
			console.log('channel is down');
			if (!cookies.server || !cookies.token) {
				throw new Error('No server or token in cookies');
			}
			timelineFeed.stream = new Stream(`https://${cookies.server}`, { token: cookies.token });
		}
	}
</script>

{#if !timelineFeed.isChannelUp}
	<div class="relative">
		<Button
			class="absolute left-1/2 top-2 z-10 h-8 w-12"
			size="icon"
			variant="secondary"
			onclick={() => {
				timelineFeed.initFeed();
				timelineFeed.setChannel();
			}}
		>
			<IconArrowUpToLine />
		</Button>
	</div>
{/if}
{#key feedHash}
	<ScrollArea type="auto" class="flex-grow p-4" {onscroll}>
		<MisskeyNotes notes={timelineFeed.notes} />
	</ScrollArea>
{/key}
