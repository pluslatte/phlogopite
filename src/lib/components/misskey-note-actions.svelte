<script lang="ts">
	import Button, { buttonVariants } from '@/components/ui/button/button.svelte';
	import { api as misskeyApi } from 'misskey-js';
	import type { Note } from 'misskey-js/entities.js';
	import { getContext } from 'svelte';
	import {
		DropdownMenu,
		DropdownMenuGroup,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem
	} from '@/components/ui/dropdown-menu';
	import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';

	import IconReply from 'lucide-svelte/icons/reply';
	import IconRepeat2 from 'lucide-svelte/icons/repeat-2';
	import IconSmilePlus from 'lucide-svelte/icons/smile-plus';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';
	import CreateNote from './create-note.svelte';

	let { note }: { note: Note } = $props();
	let dialogOpen: boolean = $state(false);

	let cli: misskeyApi.APIClient = getContext<{ cli: misskeyApi.APIClient }>('client').cli;
	if (!cli) {
		console.error('no misskeyApiClient found');
	}

	const renote = () => {
		cli
			.request('notes/create', { visibility: 'public', renoteId: note.id })
			.then(() => {})
			.catch(() => {
				console.error('renote failed');
			});
	};

	const openDialog = () => {
		dialogOpen = true;
	};
</script>

<div class="flex flex-row gap-8 p-2">
	<Button variant="ghost" size="icon" class="rounded-full">
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
				<DropdownMenuItem onclick={openDialog}>Quote</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconSmilePlus class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconEllipsis class="h-4 w-4" />
	</Button>
</div>
<!-- https://github.com/huntabyte/shadcn-svelte/issues/902 -->
<Dialog
	bind:open={dialogOpen}
	onOpenChange={(open) => {
		dialogOpen = open;
	}}
>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Quote</DialogTitle>
		</DialogHeader>
		<CreateNote />
	</DialogContent>
</Dialog>
