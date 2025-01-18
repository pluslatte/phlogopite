<script lang="ts">
	import { Stream } from 'misskey-js';
	import { api as misskeyApi } from 'misskey-js';
	import type { Notification } from 'misskey-js/entities.js';
	import { onMount } from 'svelte';

	import MisskeyNote from './misskey-note.svelte';
	import Separator from './ui/separator/separator.svelte';

	let { data } = $props();
	const cli = new misskeyApi.APIClient({
		origin: `https://${data.server}`,
		credential: data.token
	});

	class NotificationFeed {
		notifications: Notification[] = $state([]);

		init(): void {
			if (!data.server || !data.token) return;
			cli.request('i/notifications', { limit: 20 }).then((got) => {
				got.forEach((notication) => {
					this.notifications.push(notication);
				});
			});
			const stream = new Stream(`https://${data.server}`, { token: data.token });
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
