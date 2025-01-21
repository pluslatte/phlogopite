<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger
	} from '@/components/ui/select';

	import { api as misskeyApi } from 'misskey-js';
	import AvatarFallBackAnim from './avatar-fall-back-anim.svelte';
	import type { IResponse } from 'misskey-js/entities.js';
	import { getContext, onMount } from 'svelte';
	import { toggleMode } from 'mode-watcher';

	import IconSun from 'lucide-svelte/icons/sun';
	import IconMoon from 'lucide-svelte/icons/moon';
	import IconGlobe from 'lucide-svelte/icons/globe';
	import IconSend from 'lucide-svelte/icons/send';
	import IconHouse from 'lucide-svelte/icons/house';
	import IconLock from 'lucide-svelte/icons/lock';
	import IconMain from 'lucide-svelte/icons/mail';
	import PhlogopiteUserLink from './phlogopite-user-link.svelte';
	import SelectGroupHeading from './ui/select/select-group-heading.svelte';

	let newNote = $state('');
	let self: IResponse | null = $state(null);

	type Visibility = 'public' | 'home' | 'followers' | 'specified';
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

	let cli: misskeyApi.APIClient = getContext<{ cli: misskeyApi.APIClient }>('client').cli;
	if (!cli) {
		console.error('no misskeyApiClient found');
	}

	async function addNote() {
		const request = cli.request('notes/create', {
			visibility: visibility,
			text: newNote
		});

		const result = await request;
		if (result) {
			newNote = '';
		} else {
			console.error('Note creation failed');
		}
	}

	onMount(() => {
		cli.request('i', {}).then((got) => {
			self = got;
		});
	});
</script>

<form onsubmit={addNote} class="m-2">
	<div class="grid gap-4">
		<div class="flex flex-row">
			{#if self}
				<PhlogopiteUserLink username={self.username}>
					<Avatar class="rounded-lg">
						<AvatarImage src={self?.avatarUrl} alt={'@' + self?.username} />
						<AvatarFallBackAnim />
					</Avatar>
				</PhlogopiteUserLink>
			{/if}
			<div class="flex-frow ml-2 grid grid-flow-row text-sm">
				<span class="overflow-hidden text-ellipsis font-bold">{self?.name}</span>
				<span class="overflow-hidden text-ellipsis text-muted-foreground">
					{'@' + self?.username}
				</span>
			</div>
		</div>
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
