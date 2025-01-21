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

	import IconPaperclip from 'lucide-svelte/icons/paperclip';

	let {
		cookies
	}: {
		cookies: PhlogopiteCookies;
	} = $props();

	let clipId: string = $state('');

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + cookies.server,
		credential: cookies.token
	});
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="m-2">
		<Select type="single" bind:value={clipId}>
			<SelectTrigger class="w-full shrink-0">
				<IconPaperclip class="h-4 w-4" />
				<span>Select a clip to show</span>
			</SelectTrigger>
			<SelectGroup>
				<SelectContent>
					<SelectGroupHeading>clips</SelectGroupHeading>
					{#await cli.request('clips/list', {})}
						Loading...
					{:then clips}
						{#each clips as clip}
							<SelectItem value={clip.id}>
								<span class="pl-2">{clip.name}</span>
							</SelectItem>
						{/each}
					{/await}
				</SelectContent>
			</SelectGroup>
		</Select>
	</div>
	<ScrollArea type="auto" class="flex-grow p-4">
		{#if clipId}
			{#await cli.request('clips/notes', { clipId })}
				Loading...
			{:then notes: Note[]}
				<MisskeyNotes {notes} />
			{/await}
		{/if}
	</ScrollArea>
</div>
