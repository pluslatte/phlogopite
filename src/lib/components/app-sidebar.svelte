<script lang="ts">
	import SidebarContent from './ui/sidebar/sidebar-content.svelte';
	import SidebarHeader from './ui/sidebar/sidebar-header.svelte';
	import Sidebar from './ui/sidebar/sidebar.svelte';

	import Button from '@/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';

	import IconBell from 'lucide-svelte/icons/bell';
	import IconSettings from 'lucide-svelte/icons/settings';

	import { api as misskeyApi } from 'misskey-js';
	import type { IResponse } from 'misskey-js/entities.js';
	import { onMount, setContext } from 'svelte';
	import CreateNote from './create-note.svelte';
	import NotificationFeed from './notification-feed.svelte';

	let {
		cookies
	}: {
		cookies: {
			server: string;
			token: string;
		};
	} = $props();
	const cli = new misskeyApi.APIClient({
		origin: 'https://' + cookies.server,
		credential: cookies.token
	});

	let notifications = $state(['Hello, Misskey', 'Hello, SvelteKit']);
	let newNote = $state('');
	let self: IResponse | null = $state(null);

	async function addNote() {
		const request = cli.request('notes/create', {
			visibility: 'home',
			text: newNote
		});

		const result = await request;
		if (result) {
			// TODO: show created note in timeline if visible.
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

	setContext('client', {
		cli
	});
</script>

<Sidebar>
	<SidebarHeader>
		<CreateNote {cookies} />
		<Separator />
	</SidebarHeader>
	<SidebarContent>
		<div class="mb-2 ml-4 mr-4 flex flex-row items-center gap-2">
			<IconBell class="h-4 w-4" />
			<p class="flex-grow">Notification</p>
			<Button variant="ghost" size="icon" class="rounded-full">
				<IconSettings class="h-4 w-4" />
			</Button>
		</div>
		<ScrollArea type="auto" class="flex-grow p-2 pr-4">
			<NotificationFeed {cookies} />
		</ScrollArea>
	</SidebarContent>
</Sidebar>
