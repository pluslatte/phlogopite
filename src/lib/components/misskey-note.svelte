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

	let { note, renotedBy, data }: { note: Note; renotedBy?: User; data: any } = $props();
</script>

{#if renotedBy}
	<div>renote</div>
{/if}
<div class="flex flex-row items-start gap-1 text-sm">
	<Avatar class="h-4 w-4">
		{#if note.user.host}
			<AvatarImage src={'http://www.google.com/s2/favicons?domain=' + note.user.host} />
		{:else}
			<AvatarImage src={'http://www.google.com/s2/favicons?domain=' + data.server} />
		{/if}
		<AvatarFallback>...</AvatarFallback>
	</Avatar>
	<Avatar class="rounded-lg mt-1">
		<AvatarImage src={note.user.avatarUrl} alt={'@' + note.user.username} />
		<AvatarFallback>...</AvatarFallback>
	</Avatar>
	<div class="flex-grow flex flex-col gap-1 ml-2">
		<div class="flex flex-row items-center gap-2">
			<span class="font-bold">{note.user.name}</span>
			<span class="text-muted-foreground">
				{'@' + note.user.username + (note.user.host ? '@' + note.user.host : '')}
			</span>
			<span class="flex-grow"></span>
			<span class="text-muted-foreground">{note.createdAt}</span>
		</div>
		<!-- ながい文を表示すると画面があふれる -->
		<!-- <p style="white-space: pre-wrap;">{note}</p> -->
		<!-- これで直ったが、どうして？ -->
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
