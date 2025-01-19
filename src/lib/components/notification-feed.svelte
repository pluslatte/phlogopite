<script lang="ts">
	import { Stream } from 'misskey-js';
	import { api as misskeyApi } from 'misskey-js';
	import type { Notification } from 'misskey-js/entities.js';
	import { onMount } from 'svelte';

	import MisskeyNote from './misskey-note.svelte';
	import Separator from './ui/separator/separator.svelte';
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';

	let {
		cookies
	}: {
		cookies: PhlogopiteCookies;
	} = $props();
	const cli = new misskeyApi.APIClient({
		origin: `https://${cookies.server}`,
		credential: cookies.token
	});

	class NotificationFeed {
		notifications: Notification[] = $state([]);

		init(): void {
			if (!cookies.server || !cookies.token) return;
			cli.request('i/notifications', { limit: 20 }).then((got) => {
				got.forEach((notication) => {
					this.notifications.push(notication);
				});
			});
			const stream = new Stream(`https://${cookies.server}`, { token: cookies.token });
			const channelMain = stream.useChannel('main');
			// channelMain.on('');
		}
	}
	const notificationFeed = new NotificationFeed();

	onMount(() => {
		notificationFeed.init();
	});
</script>

{#each notificationFeed.notifications as notification (notification.id)}
	{#if notification.type == 'mention'}
		<MisskeyNote note={notification.note} />
	{:else if notification.type == 'reply'}
		<MisskeyNote note={notification.note} />
	{:else}
		<div>{'WIP:[notification.type = ' + notification.type + ']'}</div>
	{/if}
	<Separator class="my-2" />
{/each}
