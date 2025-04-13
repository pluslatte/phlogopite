<script lang="ts">
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';
	import MisskeyNotes from './misskey-notes.svelte';
	import type { Note } from 'misskey-js/entities.js';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '@/components/ui/select';
	import SelectGroupHeading from './ui/select/select-group-heading.svelte';

	import IconClipboardList from 'lucide-svelte/icons/clipboard-list';
	import { getApiClientContext } from '@/api-client-context';

	let listId: string = $state('');
	let listName: string = $state('');

	const misskeyApiClient = getApiClientContext();
	$effect(() => {
		let isCancelled = false;
		if (!listId) return;
		misskeyApiClient.request('users/lists/show', { listId: listId }).then((got) => {
			if (!isCancelled) {
				listName = got.name;
			}
		});

		return () => {
			isCancelled = true;
		};
	});
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="m-2">
		<Select type="single" bind:value={listId}>
			<SelectTrigger class="w-full shrink-0">
				<IconClipboardList class="h-4 w-4" />
				{#if listId}
					<span>{`Selected: ${listName}`}</span>
				{:else}
					<span>{'Select a list to show'}</span>
				{/if}
			</SelectTrigger>
			<SelectGroup>
				<SelectContent>
					<SelectGroupHeading>clips</SelectGroupHeading>
					{#await misskeyApiClient.request('users/lists/list', {})}
						Loading...
					{:then lists}
						{#each lists as list}
							<SelectItem value={list.id}>
								<span class="pl-2">{list.name}</span>
							</SelectItem>
						{/each}
					{/await}
				</SelectContent>
			</SelectGroup>
		</Select>
	</div>
	<ScrollArea type="auto" class="flex-grow p-4">
		{#if listId}
			{#await misskeyApiClient.request('notes/user-list-timeline', { listId: listId })}
				Loading...
			{:then notes: Note[]}
				<MisskeyNotes {notes} />
			{/await}
		{/if}
	</ScrollArea>
</div>
