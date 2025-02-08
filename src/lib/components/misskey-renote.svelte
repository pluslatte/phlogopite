<script lang="ts">
	import type { Note, User } from 'misskey-js/entities.js';
	import MfmTextRenderer from './mfm-text-renderer.svelte';
	import * as mfm from 'mfm-js';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import MisskeyQuote from '@/components/misskey-quote.svelte';
	import PhlogopiteUserLink from './phlogopite-user-link.svelte';

	import Repeat_2 from 'lucide-svelte/icons/repeat-2';

	let { renotedBy, renote }: { renotedBy: User; renote: Note } = $props();
</script>

<div class="m-2 flex flex-row items-center gap-2">
	<Repeat_2 class="h-4 w-4 text-muted-foreground" />
	<div class="text-sm text-muted-foreground">
		<PhlogopiteUserLink username={renotedBy.username} host={renotedBy.host}>
			<MfmTextRenderer
				mfmNodes={mfm.parse('Renoted by ' + renotedBy.name)}
				assets={{ host: renotedBy.host, emojis: renotedBy.emojis }}
			/>
		</PhlogopiteUserLink>
	</div>
</div>
{#if renote.renote && renote.text}
	<MisskeyQuote quotedBy={renote.user} note={renote} quote={renote.renote} />
{:else}
	<MisskeyNote note={renote} />
{/if}
