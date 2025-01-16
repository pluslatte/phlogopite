<script lang="ts">
	let { data } = $props();

	import SidebarContent from './ui/sidebar/sidebar-content.svelte';
	import SidebarHeader from './ui/sidebar/sidebar-header.svelte';
	import Sidebar from './ui/sidebar/sidebar.svelte';

	import Button from '@/components/ui/button/button.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import Input from '@/components/ui/input/input.svelte';

	import IconSun from 'lucide-svelte/icons/sun';
	import IconMoon from 'lucide-svelte/icons/moon';
	import IconGlobe from 'lucide-svelte/icons/globe';
	import IconSend from 'lucide-svelte/icons/send';
	import IconRocket from 'lucide-svelte/icons/rocket';
	import IconBell from 'lucide-svelte/icons/bell';
	import IconSettings from 'lucide-svelte/icons/settings';

	import { toggleMode } from 'mode-watcher';
	import { api as misskeyApi } from 'misskey-js';

	let notifications = $state(['Hello, Misskey', 'Hello, SvelteKit']);
	let newNote = $state('');

	async function addNote() {
		const cli = new misskeyApi.APIClient({
			origin: 'https://' + data.server,
			credential: data.token
		});

		const request = cli.request('notes/create', {
			visibility: 'home',
			text: newNote
		});

		await request;
	}
</script>

<Sidebar>
	<SidebarHeader>
		<form onsubmit={addNote} class="m-2">
			<div class="grid gap-4">
				<div class="flex flex-row">
					<Avatar class="rounded-lg">
						<AvatarImage
							src="https://media.virtualkemomimi.net/files/d55bc44c-46b5-4f92-80fd-c8a66ab0b4b5.png"
							alt="@pluslatte"
						/>
						<AvatarFallback>...</AvatarFallback>
					</Avatar>
					<div class="flex-frow grid grid-flow-row ml-2 text-sm">
						<span class="font-bold text-ellipsis overflow-hidden">Username</span>
						<span class="text-muted-foreground text-ellipsis overflow-hidden"
							>@id@long_long_looong_server_name</span
						>
					</div>
				</div>
				<Textarea bind:value={newNote} placeholder="Type something..." class="h-40 border"
				></Textarea>
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
					<Button variant="outline" size="icon" class="rounded-r-none border-r-0 shrink-0">
						<IconGlobe />
					</Button>
					<Separator orientation="vertical" />
					<Button variant="outline" size="icon" class="rounded-l-none border-l-0 shrink-0">
						<IconRocket />
					</Button>
					<Separator orientation="vertical" class="mx-4" />
					<Button type="submit" size="icon" class="shrink-0">
						<IconSend class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</form>
		<Separator />
	</SidebarHeader>
	<SidebarContent>
		<div class="flex flex-row items-center gap-2 ml-4 mr-4 mb-2">
			<IconBell class="h-4 w-4" />
			<p class="flex-grow">Notification</p>
			<Button variant="ghost" size="icon" class="rounded-full">
				<IconSettings class="h-4 w-4" />
			</Button>
		</div>
		<ScrollArea type="auto" class="flex-grow m-4 mt-0">
			{#each notifications as notification}
				<div>{notification}</div>
			{/each}
		</ScrollArea>
	</SidebarContent>
</Sidebar>
