<script lang="ts">
	import { api as misskeyApi } from 'misskey-js';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
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

	let {
		cookies
	}: {
		cookies: PhlogopiteCookies;
	} = $props();

	let listId: string = $state('');
	let listName: string = $state('');

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + cookies.server,
		credential: cookies.token
	});

	$effect(() => {
		let isCancelled = false;
		if (!listId) return;
		cli.request('users/lists/show', { listId: listId }).then((got) => {
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
					{#await cli.request('users/lists/list', {})}
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
			{#await cli.request('notes/user-list-timeline', { listId: listId })}
				Loading...
			{:then notes: Note[]}
				<MisskeyNotes {notes} />
			{/await}
		{/if}
	</ScrollArea>
</div>
