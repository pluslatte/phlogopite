<script lang="ts">
	import Button, { buttonVariants } from '@/components/ui/button/button.svelte';
	import { api as misskeyApi } from 'misskey-js';
	import type { EmojiSimple, Note } from 'misskey-js/entities.js';
	import { getContext } from 'svelte';
	import {
		DropdownMenu,
		DropdownMenuGroup,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem
	} from '@/components/ui/dropdown-menu';
	import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
	import { toast } from 'svelte-sonner';

	import IconReply from 'lucide-svelte/icons/reply';
	import IconRepeat2 from 'lucide-svelte/icons/repeat-2';
	import IconSmilePlus from 'lucide-svelte/icons/smile-plus';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';
	import CreateNote from './create-note.svelte';
	import MisskeyNote from './misskey-note.svelte';

	let { note }: { note: Note } = $props();
	let isQuoteDialogOpen: boolean = $state(false);
	let isReplyDialogOpen: boolean = $state(false);
	let isReactionDialogOpen: boolean = $state(false);

	let cli: misskeyApi.APIClient = getContext<{ cli: misskeyApi.APIClient }>('client').cli;
	if (!cli) {
		console.error('no misskeyApiClient found');
	}

	function renote(): void {
		cli
			.request('notes/create', { visibility: 'public', renoteId: note.id })
			.then(() => {
				toast.success('Renoted.');
			})
			.catch(() => {
				toast.error('Renote failed.');
			});
	}

	function createReaction(noteId: string, reactionName: string): void {
		cli
			.request('notes/reactions/create', { noteId, reaction: reactionName })
			.then(() => {
				toast.success('Successfully created a reaction.');
			})
			.catch((error: Error) => {
				toast.error(`Reaction creation failed: ${error.message}`);
			});
	}

	function deleteReaction(noteId: string): void {
		cli
			.request('notes/reactions/delete', { noteId })
			.then(() => {
				toast.success('Successfully removed a reaction.');
			})
			.catch((error: Error) => {
				toast.error(`Reaction removement failed: ${error.message}`);
			});
	}

	async function getAllAvailableEmojis(): Promise<EmojiSimple[]> {
		const got = await cli.request('emojis', {});
		return got.emojis;
	}
</script>

<div class="flex flex-row gap-8 p-2">
	<Button
		variant="ghost"
		size="icon"
		class="rounded-full"
		onclick={() => {
			isReplyDialogOpen = true;
		}}
	>
		<IconReply class="h-4 w-4" />
	</Button>
	<DropdownMenu>
		<DropdownMenuTrigger
			class={buttonVariants({ variant: 'ghost', size: 'icon', class: 'rounded-full' })}
		>
			<IconRepeat2 class="h-4 w-4" />
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuGroup>
				<!-- <DropdownMenuGroupHeading>Renote</DropdownMenuGroupHeading> -->
				<DropdownMenuItem onclick={renote}>Renote</DropdownMenuItem>
				<DropdownMenuItem
					onclick={() => {
						isQuoteDialogOpen = true;
					}}>Quote</DropdownMenuItem
				>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
	<Button
		variant="ghost"
		size="icon"
		class="rounded-full"
		onclick={() => {
			isReactionDialogOpen = true;
		}}
	>
		<IconSmilePlus class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconEllipsis class="h-4 w-4" />
	</Button>
</div>
<!-- https://github.com/huntabyte/shadcn-svelte/issues/902 -->
<!-- quote dialog -->
<Dialog
	bind:open={isQuoteDialogOpen}
	onOpenChange={(open) => {
		isQuoteDialogOpen = open;
	}}
>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Quote</DialogTitle>
			<MisskeyNote {note} />
		</DialogHeader>
		<CreateNote
			quoteTarget={note}
			onNoteSubmissionSuccess={() => {
				isQuoteDialogOpen = false;
			}}
		/>
	</DialogContent>
</Dialog>
<!-- reply dialog -->
<Dialog
	bind:open={isReplyDialogOpen}
	onOpenChange={(open) => {
		isReplyDialogOpen = open;
	}}
>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Reply</DialogTitle>
			<MisskeyNote {note} />
		</DialogHeader>
		<CreateNote
			replyTarget={note}
			onNoteSubmissionSuccess={() => {
				isReplyDialogOpen = false;
			}}
		/>
	</DialogContent>
</Dialog>
<!-- reaction dialog -->
<Dialog
	bind:open={isReactionDialogOpen}
	onOpenChange={(open) => {
		isReactionDialogOpen = open;
	}}
>
	<DialogContent>
		<DialogHeader>Reaction</DialogHeader>
		<button
			onclick={() => {
				createReaction(note.id, 'star');
				isReactionDialogOpen = false;
			}}
		>
			star
		</button>
	</DialogContent>
</Dialog>
