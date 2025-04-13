<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '@/components/ui/select';
	import { toast } from 'svelte-sonner';

	import { api as misskeyApi } from 'misskey-js';
	import type { Note } from 'misskey-js/entities.js';
	import { toggleMode } from 'mode-watcher';

	import IconSun from 'lucide-svelte/icons/sun';
	import IconMoon from 'lucide-svelte/icons/moon';
	import IconGlobe from 'lucide-svelte/icons/globe';
	import IconSend from 'lucide-svelte/icons/send';
	import IconHouse from 'lucide-svelte/icons/house';
	import IconLock from 'lucide-svelte/icons/lock';
	import IconMain from 'lucide-svelte/icons/mail';
	import SelectGroupHeading from './ui/select/select-group-heading.svelte';
	import { getApiClientContext } from '@/api-client-context';

	let {
		quoteTarget,
		replyTarget,
		onNoteSubmissionSuccess
	}: {
		quoteTarget?: Note;
		replyTarget?: Note;
		onNoteSubmissionSuccess?: () => void;
	} = $props();

	type Visibility = 'public' | 'home' | 'followers' | 'specified';

	let newNote: string = $state('');
	let rawVisibility: string = $state('public');
	let visibility: Visibility = $derived.by(() => {
		switch (rawVisibility) {
			case 'public':
			case 'home':
			case 'followers':
			case 'specified':
				return rawVisibility as Visibility;
			default:
				return 'public' as Visibility;
		}
	});

	let misskeyApiClient: misskeyApi.APIClient = getApiClientContext();
	if (!misskeyApiClient) {
		console.error('no misskeyApiClient found');
	}

	function addNote() {
		misskeyApiClient
			.request('notes/create', {
				visibility: visibility,
				text: newNote,
				replyId: replyTarget ? replyTarget.id : null,
				renoteId: quoteTarget ? quoteTarget.id : null
			})
			.then(() => {
				newNote = '';
				if (onNoteSubmissionSuccess) {
					onNoteSubmissionSuccess();
				}
				toast.success('Successfully created a note.');
			})
			.catch((error: Error) => {
				toast.error(`Note creation failed: ${error.message}`);
			});
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		addNote();
	}}
>
	<div class="grid gap-2">
		<Textarea bind:value={newNote} placeholder="Type something..." class="h-40 border"></Textarea>
		<div class="flex flex-row">
			<Button onclick={toggleMode} variant="outline" size="icon">
				<IconSun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<IconMoon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<div class="flex-grow"></div>
			<Select type="single" bind:value={rawVisibility}>
				<SelectTrigger class="w-[64px] shrink-0">
					{#if visibility == 'public'}
						<IconGlobe class="h-4 w-4" />
					{:else if visibility == 'home'}
						<IconHouse class="h-4 w-4" />
					{:else if visibility == 'followers'}
						<IconLock class="h-4 w-4" />
					{:else if visibility == 'specified'}
						<IconMain class="h-4 w-4" />
					{/if}
				</SelectTrigger>
				<SelectGroup>
					<SelectContent>
						<SelectGroupHeading>visibility</SelectGroupHeading>
						<SelectItem value="public">
							<IconGlobe class="h-4 w-4" />
							<span class="pl-2">public</span>
						</SelectItem>
						<SelectItem value="home">
							<IconHouse class="h-4 w-4" />
							<span class="pl-2">home only</span>
						</SelectItem>
						<SelectItem value="followers">
							<IconLock class="h-4 w-4" />
							<span class="pl-2">followers only</span>
						</SelectItem>
						<SelectItem value="specified">
							<IconMain class="h-4 w-4" />
							<span class="pl-2">DM</span>
						</SelectItem>
					</SelectContent>
				</SelectGroup>
			</Select>
			<Separator orientation="vertical" class="mx-4" />
			<Button type="submit" size="icon" class="shrink-0">
				<IconSend class="h-4 w-4" />
			</Button>
		</div>
	</div>
</form>
