<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';

	import { api as misskeyApi } from 'misskey-js';
	import AvatarFallBackAnim from './avatar-fall-back-anim.svelte';
	import type { IResponse } from 'misskey-js/entities.js';
	import { onMount } from 'svelte';
	import { toggleMode } from 'mode-watcher';

	import IconSun from 'lucide-svelte/icons/sun';
	import IconMoon from 'lucide-svelte/icons/moon';
	import IconGlobe from 'lucide-svelte/icons/globe';
	import IconSend from 'lucide-svelte/icons/send';
	import IconRocket from 'lucide-svelte/icons/rocket';
	import PhlogopiteUserLink from './phlogopite-user-link.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';

	let {
		cookies
	}: {
		cookies: PhlogopiteCookies;
	} = $props();

	let newNote = $state('');
	let self: IResponse | null = $state(null);

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + cookies.server,
		credential: cookies.token
	});

	async function addNote() {
		const request = cli.request('notes/create', {
			visibility: 'home',
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
				<span class="overflow-hidden text-ellipsis text-muted-foreground"
					>{'@' + self?.username + '@' + cookies.server}</span
				>
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
			<Button variant="outline" size="icon" class="shrink-0 rounded-r-none border-r-0">
				<IconGlobe />
			</Button>
			<Separator orientation="vertical" />
			<Button variant="outline" size="icon" class="shrink-0 rounded-l-none border-l-0">
				<IconRocket />
			</Button>
			<Separator orientation="vertical" class="mx-4" />
			<Button type="submit" size="icon" class="shrink-0">
				<IconSend class="h-4 w-4" />
			</Button>
		</div>
	</div>
</form>
