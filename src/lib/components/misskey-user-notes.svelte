<script lang="ts">
	import { onMount } from 'svelte';

	import MisskeyNotes from './misskey-notes.svelte';
	import type { Note, UserDetailed } from 'misskey-js/entities.js';
	import { getApiClientContext } from '@/api-client-context';

	let {
		noteListType,
		user
	}: {
		noteListType: string;
		user: UserDetailed;
	} = $props();

	let loadingMore: boolean = $state(false);
	const misskeyApiClient = getApiClientContext();

	class UserNotes {
		notes: Note[] = $state([]);

		add_note_end(note: Note): void {
			this.notes.push(note);
		}

		loadMore(): void {
			if (loadingMore) {
				return;
			}
			loadingMore = true;

			const LIMIT: number = 12;
			const lastNoteId: string | null = this.notes[this.notes.length - 1]?.id;
			const addMoreNotes = (notes: Note[]) => {
				notes.shift();
				notes.forEach((note) => {
					this.add_note_end(note);
				});
				loadingMore = false;
			};
			const addInitialNotes = (notes: Note[]) => {
				notes.forEach((note) => {
					this.add_note_end(note);
				});
				loadingMore = false;
			};

			switch (noteListType) {
				case 'normal':
					misskeyApiClient
						.request('users/notes', {
							limit: LIMIT,
							userId: user.id,
							withReplies: false,
							untilId: lastNoteId
						})
						.then(lastNoteId ? addMoreNotes : addInitialNotes);
					break;
				case 'withReplies':
					misskeyApiClient
						.request('users/notes', {
							limit: LIMIT,
							userId: user.id,
							withReplies: true,
							untilId: lastNoteId
						})
						.then(lastNoteId ? addMoreNotes : addInitialNotes);
					break;
				case 'onlyFiles':
					misskeyApiClient
						.request('users/notes', {
							limit: LIMIT,
							userId: user.id,
							withFiles: true,
							untilId: lastNoteId
						})
						.then(lastNoteId ? addMoreNotes : addInitialNotes);
					break;
				default:
					console.error('Undefined noteListType: ' + noteListType);
					return;
			}
		}
	}

	const userNotes = new UserNotes();

	function setupObserver(node: HTMLElement): { destroy: () => void } {
		const observer = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]) => {
				if (entries[0].isIntersecting) {
					userNotes.loadMore();
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

<MisskeyNotes notes={userNotes.notes} />
<div bind:this={sentinel} use:setupObserver style="height: 1px;">...</div>
{#if loadingMore}
	<p>{'Loading...'}</p>
{/if}
