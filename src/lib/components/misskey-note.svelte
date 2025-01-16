<script lang="ts">
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';

	import IconReply from 'lucide-svelte/icons/reply';
	import IconRepeat2 from 'lucide-svelte/icons/repeat-2';
	import IconSmilePlus from 'lucide-svelte/icons/smile-plus';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';

	import type { Note, User } from 'misskey-js/entities.js';
	import Repeat_2 from 'lucide-svelte/icons/repeat-2';

	let { note, renotedBy, data }: { note: Note; renotedBy?: User; data: any } = $props();
</script>

{#if renotedBy}
	<div class="flex flex-row gap-2 items-center m-2">
		<div class="w-3"></div>
		<Repeat_2 class="h-4 w-4 text-muted-foreground" />
		<div class="text-sm text-muted-foreground">{'Renoted by ' + renotedBy.name}</div>
	</div>
{/if}
<div class="flex flex-row items-start gap-1 text-sm">
	<Avatar class="h-4 w-4">
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
		<AvatarFallback>...</AvatarFallback>
	</Avatar>
	<Avatar class="rounded-lg mt-1">
		<AvatarImage src={note.user.avatarUrl} alt={'@' + note.user.username} />
		<AvatarFallback>...</AvatarFallback>
	</Avatar>
	<div class="flex-grow gap-1 ml-2">
		<div class="grid grid-flow-col">
			<div class="grid grid-flow-row pb-2">
				<span class="font-bold overflow-hidden text-ellipsis whitespace-nowrap"
					>{note.user.name}</span
				>
				<span class="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">
					{'@' + note.user.username + (note.user.host ? '@' + note.user.host : '')}
				</span>
			</div>
			<span class="text-right text-muted-foreground whitespace-nowrap">{note.createdAt}</span>
		</div>
		<p style="white-space: pre-wrap; word-break: break-word;">
			{note.text}
		</p>
	</div>
</div>
<div class="flex flex-row p-2 gap-8">
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
<Separator class="mb-4" />
