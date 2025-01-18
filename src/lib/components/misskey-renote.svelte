<script lang="ts">
	import type { Note, User } from 'misskey-js/entities.js';

	import Repeat_2 from 'lucide-svelte/icons/repeat-2';

	import MfmText from './mfm-text.svelte';
	import * as mfm from 'mfm-js';
	import MisskeyNote from '@/components/misskey-note.svelte';

	let { renotedBy, renote }: { renotedBy: User; renote: Note } = $props();
</script>

<div class="m-2 flex flex-row items-center gap-2">
	<div class="w-3"></div>
	<Repeat_2 class="h-4 w-4 text-muted-foreground" />
	<div class="text-sm text-muted-foreground">
		<MfmText
			mfmNodes={mfm.parse('Renoted by ' + renotedBy.name)}
			assets={{ host: renotedBy.host, emojis: renotedBy.emojis }}
		/>
	</div>
</div>
<MisskeyNote note={renote} />
