<script lang="ts">
	import SidebarContent from './ui/sidebar/sidebar-content.svelte';
	import SidebarHeader from './ui/sidebar/sidebar-header.svelte';
	import Sidebar from './ui/sidebar/sidebar.svelte';

	import Button from '@/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';

	import IconBell from 'lucide-svelte/icons/bell';
	import IconSettings from 'lucide-svelte/icons/settings';

	import CreateNote from './create-note.svelte';
	import NotificationFeed from './notification-feed.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import ProfileIndicator from './profile-indicator.svelte';

	let {
		cookies
	}: {
		cookies: PhlogopiteCookies;
	} = $props();

	const voidFunc = () => {};
</script>

<Sidebar>
	<SidebarHeader>
		<div class="m-1">
			<ProfileIndicator />
			<Separator class="my-2" />
			<CreateNote onNoteSubmissionSuccess={voidFunc} />
			<Separator class="my-2" />
		</div>
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
