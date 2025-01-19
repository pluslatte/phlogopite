<script lang="ts">
	import type { Note } from 'misskey-js/entities.js';
	import MisskeyRenote from '@/components/misskey-renote.svelte';
	import MisskeyNoteActions from '@/components/misskey-note-actions.svelte';
	import MisskeyQuote from '@/components/misskey-quote.svelte';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';

	let { notes }: { notes: Note[] } = $props();
</script>

{#each notes as note (note.id)}
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
