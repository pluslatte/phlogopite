<script lang="ts">
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import Button from '@/components/ui/button/button.svelte';

	import IconReply from 'lucide-svelte/icons/reply';
	import IconRepeat2 from 'lucide-svelte/icons/repeat-2';
	import IconSmilePlus from 'lucide-svelte/icons/smile-plus';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';

	import type { Note, User } from 'misskey-js/entities.js';
	import Repeat_2 from 'lucide-svelte/icons/repeat-2';
	import { formatDistanceStrict, parseISO } from 'date-fns';
	import AvatarFallBackAnim from './avatar-fall-back-anim.svelte';
	import MfmText from './mfm-text.svelte';
	import * as mfm from 'mfm-js';

	let {
		note,
		renotedBy,
		quotedBy,
		data
	}: { note: Note; renotedBy?: User; quotedBy?: User; data: any } = $props();

	function GetTimestampFromISO8601(iso_string: string): string {
		const gotDate = parseISO(iso_string);
		const currentDate = new Date();
		return formatDistanceStrict(currentDate, gotDate, { addSuffix: true });
	}
</script>

{#if renotedBy}
	<div class="m-2 flex flex-row items-center gap-2">
		<div class="w-3"></div>
		<Repeat_2 class="h-4 w-4 text-muted-foreground" />
		<div class="text-sm text-muted-foreground">
			<MfmText
				mfmNodes={mfm.parse('Renoted by ' + renotedBy.name)}
				assets={{ host: renotedBy.host }}
			/>
		</div>
	</div>
{:else if quotedBy}
	<div class="m-2 flex flex-row items-center gap-2">
		<div class="w-3"></div>
		<Repeat_2 class="h-4 w-4 text-muted-foreground" />
		<div class="text-sm text-muted-foreground">
			<MfmText
				mfmNodes={mfm.parse('Quoted by ' + quotedBy.name)}
				assets={{ host: quotedBy.host }}
			/>
		</div>
	</div>
{/if}
<div class="flex flex-row items-start text-sm">
	<Avatar class="ml-2 mt-1 rounded-lg">
		<AvatarImage src={note.user.avatarUrl} alt={'@' + note.user.username} />
		<AvatarFallBackAnim />
	</Avatar>
	<div class="ml-2 grid flex-grow">
		<div class="flex w-full flex-row overflow-hidden">
			{#if note.user.name}
				<div class="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
					<MfmText mfmNodes={mfm.parse(note.user.name)} assets={{ host: note.user.host }} />
				</div>
			{/if}
			<div class="overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
				{'@' + note.user.username + (note.user.host ? '@' + note.user.host : '')}
			</div>
			<div class="w-4"></div>
			<div class="ml-auto whitespace-nowrap text-muted-foreground">
				{GetTimestampFromISO8601(note.createdAt)}
			</div>
		</div>
		<!-- main text -->
		<!-- https://qiita.com/ist-a-k/items/2b1385574e1a1babdde1 -->
		{#if note.text}
			<div class="min-w-0 whitespace-pre-wrap text-wrap" style="word-break: break-word;">
				<MfmText
					mfmNodes={mfm.parse(note.text)}
					assets={{ host: note.user.host, emojis: note.emojis }}
				/>
			</div>
		{/if}
		<!-- image -->
		{#if note.files}
			<div class="flex flex-row flex-wrap">
				{#each note.files as file}
					<img src={file.thumbnailUrl} alt={file.name} class="m-2 max-w-64 rounded-lg" />
				{/each}
			</div>
		{/if}
	</div>
</div>
<div class="flex flex-row gap-8 p-2">
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconReply class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconRepeat2 class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconSmilePlus class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconEllipsis class="h-4 w-4" />
	</Button>
</div>
