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
		<div class="text-sm text-muted-foreground">{'Renoted by ' + renotedBy.name}</div>
	</div>
{:else if quotedBy}
	<div class="m-2 flex flex-row items-center gap-2">
		<div class="w-3"></div>
		<Repeat_2 class="h-4 w-4 text-muted-foreground" />
		<div class="text-sm text-muted-foreground">{'Quoted by ' + quotedBy.name}</div>
	</div>
{/if}
<div class="flex flex-row items-start text-sm">
	<!-- <Avatar class="h-4 w-4">
		{#if note.user.host}
			<AvatarImage
				class="rounded-sm"
				src={'http://www.google.com/s2/favicons?domain=' + note.user.host}
			/>
		{:else}
			<AvatarImage
				class="rounded-sm"
				src={'http://www.google.com/s2/favicons?domain=' + data.server}
			/>
		{/if}
		<AvatarFallBackAnim />
	</Avatar> -->
	<Avatar class="ml-2 mt-1 rounded-lg">
		<AvatarImage src={note.user.avatarUrl} alt={'@' + note.user.username} />
		<AvatarFallBackAnim />
	</Avatar>
	<div class="ml-2 grid flex-grow">
		<div class="flex w-full flex-row overflow-hidden">
			<div class="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
				{note.user.name}
			</div>
			<div class="overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
				{'@' + note.user.username + (note.user.host ? '@' + note.user.host : '')}
			</div>
			<div class="w-4"></div>
			<div class="ml-auto whitespace-nowrap text-muted-foreground">
				{GetTimestampFromISO8601(note.createdAt)}
			</div>
		</div>
		<p class="whitespace-pre-wrap break-words">
			{note.text}
		</p>
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
