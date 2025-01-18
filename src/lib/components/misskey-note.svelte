<script lang="ts">
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';

	import type { Note } from 'misskey-js/entities.js';
	import { formatDistanceStrict, parseISO } from 'date-fns';
	import AvatarFallBackAnim from './avatar-fall-back-anim.svelte';
	import MfmText from './mfm-text.svelte';
	import * as mfm from 'mfm-js';

	let { note }: { note: Note } = $props();

	function GetTimestampFromISO8601(iso_string: string): string {
		const gotDate = parseISO(iso_string);
		const currentDate = new Date();
		return formatDistanceStrict(currentDate, gotDate, { addSuffix: true });
	}
</script>

<div class="flex flex-row items-start text-sm">
	<a
		href={`/user?username=${note.user.username}${note.user.host ? '&host=' + note.user.host : ''}`}
	>
		<Avatar class="ml-2 mt-1 rounded-lg">
			<AvatarImage src={note.user.avatarUrl} alt={'@' + note.user.username} />
			<AvatarFallBackAnim />
		</Avatar>
	</a>
	<div class="ml-2 grid flex-grow">
		<div class="flex w-full flex-row overflow-hidden">
			{#if note.user.name}
				<div class="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
					<MfmText
						mfmNodes={mfm.parse(note.user.name)}
						assets={{ host: note.user.host, emojis: note.user.emojis }}
					/>
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
