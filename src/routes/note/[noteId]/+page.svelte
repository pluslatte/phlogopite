<script lang="ts">
	import MisskeyRenote from '@/components/misskey-renote.svelte';
	import MisskeyNoteActions from '@/components/misskey-note-actions.svelte';
	import MisskeyQuote from '@/components/misskey-quote.svelte';
	import MisskeyNote from '@/components/misskey-note.svelte';
	import { onMount } from 'svelte';
	import { useSidebar } from '@/components/ui/sidebar';

	import IconArrowLeftFromLine from 'lucide-svelte/icons/arrow-left-from-line';
	import IconHouse from 'lucide-svelte/icons/house';
	import { Button } from '@/components/ui/button';
	import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
	import type { IResponse } from 'misskey-js/entities.js';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { getApiClientContext } from '@/api-client-context';

	let {
		data
	}: {
		data: {
			noteId: string;
		};
	} = $props();

	let self: IResponse | null = $state(null);

	const sidebar = useSidebar();

	const misskeyApiClient = getApiClientContext();
	if (!misskeyApiClient) {
		console.error('no misskeyApiClient found');
	}

	onMount(() => {
		misskeyApiClient.request('i', {}).then((got) => {
			self = got;
		});
	});
</script>

<div class="relative flex h-full flex-col overflow-auto">
	<Button
		class="absolute left-0 m-2 flex flex-row items-center gap-4 rounded-lg border"
		size="icon"
		variant="ghost"
		onclick={sidebar.toggle}
	>
		{#if sidebar.open}
			<IconArrowLeftFromLine />
		{:else}
			<Avatar class="size-8 rounded-md">
				<AvatarImage src={self?.avatarUrl} alt={'@' + self?.username} />
				<AvatarFallback>...</AvatarFallback>
			</Avatar>
		{/if}
	</Button>
	<a
		href="/"
		class="absolute right-0 m-2 flex size-10 flex-row items-center justify-center gap-4 rounded-lg border border-primary bg-primary text-primary-foreground"
	>
		<IconHouse class="size-4" />
	</a>
	<div class="h-14"></div>
	<Separator />
	{#await misskeyApiClient.request('notes/show', { noteId: data.noteId })}
		<span>
			{'Loading...'}
		</span>
	{:then note}
		<div class="p-2 pr-4">
			{#if note.renote && !note.text}
				<MisskeyRenote renotedBy={note.user} renote={note.renote} />
				<MisskeyNoteActions note={note.renote} />
			{:else if note.renote && note.text}
				<MisskeyQuote
					quotedBy={note.user}
					{note}
					quote={note.renote}
					withReply={note.reply != null}
					withReplyOfQuote={note.renote.reply != null}
				/>
				<MisskeyNoteActions {note} />
			{:else}
				<MisskeyNote {note} withReply={note.reply != null} />
				<MisskeyNoteActions {note} />
			{/if}
		</div>
	{:catch error}
		<span>{error}</span>
	{/await}
</div>
