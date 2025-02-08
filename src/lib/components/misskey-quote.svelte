<script lang="ts">
	import type { Note, User } from 'misskey-js/entities.js';

	import Repeat_2 from 'lucide-svelte/icons/repeat-2';

	import MfmTextRenderer from './mfm-text-renderer.svelte';
	import * as mfm from 'mfm-js';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import PhlogopiteUserLink from './phlogopite-user-link.svelte';

	let {
		quotedBy,
		note,
		quote,
		withReply,
		withReplyOfQuote
	}: { quotedBy: User; note: Note; quote: Note; withReply?: boolean; withReplyOfQuote?: boolean } =
		$props();
</script>

<MisskeyNote {note} hideQuoteExistenceIndicator={true} {withReply} />
<div class="flex flex-row">
	<div class="w-8"></div>
	<div class="flex-grow">
		<div class="m-2 ml-0 flex flex-row items-center gap-2">
			<Repeat_2 class="h-4 w-4 text-muted-foreground" />
			<div class="text-sm text-muted-foreground">
				<PhlogopiteUserLink username={quotedBy.username} host={quotedBy.host}>
					<MfmTextRenderer
						mfmNodes={mfm.parse('Quoted by ' + quotedBy.name)}
						assets={{ host: quotedBy.host, emojis: quotedBy.emojis }}
					/>
				</PhlogopiteUserLink>
			</div>
		</div>
		<div class="rounded-md border-2 bg-secondary bg-opacity-50 py-2 pr-2 opacity-80">
			<MisskeyNote note={quote} withReply={withReplyOfQuote} />
		</div>
	</div>
</div>
