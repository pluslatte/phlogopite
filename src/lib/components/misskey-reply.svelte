<script lang="ts">
	import type { Note, User } from 'misskey-js/entities.js';
	import MfmTextRenderer from './mfm-text-renderer.svelte';
	import * as mfm from 'mfm-js';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import MisskeyQuote from '@/components/misskey-quote.svelte';

	let { note }: { note: Note } = $props();
</script>

{#if note.reply}
	<div class="flex flex-row px-2 pb-2">
		<div class="w-8"></div>
		<div class="flex-grow">
			<div class="rounded-md border-2 bg-secondary bg-opacity-50 p-2 opacity-80">
				<MisskeyNote note={note.reply} />
			</div>
		</div>
	</div>
	<MisskeyNote {note} />
{:else}
	<div>{'reply target unknown'}</div>
	<MisskeyNote {note} />
{/if}
