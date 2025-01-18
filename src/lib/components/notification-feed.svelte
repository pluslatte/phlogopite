<script lang="ts">
	import { Stream } from 'misskey-js';
	import { api as misskeyApi } from 'misskey-js';
	import type { Notification } from 'misskey-js/entities.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	const cli = new misskeyApi.APIClient({
		origin: `https://${data.server}`,
		credential: data.token
	});

	class NotificationFeed {
		notifications: Notification[] = $state([]);

		init(): void {
			if (!data.server || !data.token) return;
			cli.request('i/notifications', {}).then((got) => {
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

{#each notificationFeed.notifications as notication (notication.id)}
	<div>{notication.id}</div>
{/each}
