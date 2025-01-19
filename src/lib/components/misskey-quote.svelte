<script lang="ts">
	import type { Note, User } from 'misskey-js/entities.js';

	import Repeat_2 from 'lucide-svelte/icons/repeat-2';

	import MfmTextRenderer from './mfm-text-renderer.svelte';
	import * as mfm from 'mfm-js';
	import MisskeyNote from '@/components/misskey-note.svelte';

	let { quotedBy, note, quote }: { quotedBy: User; note: Note; quote: Note } = $props();
</script>

<MisskeyNote {note} />
<div class="flex flex-row">
	<div class="w-8"></div>
	<div class="flex-grow">
		<div class="m-2 ml-0 flex flex-row items-center gap-2">
			<Repeat_2 class="h-4 w-4 text-muted-foreground" />
			<div class="text-sm text-muted-foreground">
				<MfmTextRenderer
					mfmNodes={mfm.parse('Quoted by ' + quotedBy.name)}
					assets={{ host: quotedBy.host, emojis: quotedBy.emojis }}
				/>
			</div>
		</div>
		<div class="rounded-md border-2 bg-secondary bg-opacity-50 p-2 opacity-80">
			<MisskeyNote note={quote} />
		</div>
	</div>
</div>
