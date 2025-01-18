<script lang="ts">
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallBackAnim from './avatar-fall-back-anim.svelte';

	import { Stream } from 'misskey-js';
	import { api as misskeyApi } from 'misskey-js';
	import type { Notification } from 'misskey-js/entities.js';
	import { onMount } from 'svelte';

	import MfmText from './mfm-text.svelte';
	import * as mfm from 'mfm-js';
	import { formatDistanceStrict, parseISO } from 'date-fns';
	import MisskeyNote from './misskey-note.svelte';

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

	function GetTimestampFromISO8601(iso_string: string): string {
		const gotDate = parseISO(iso_string);
		const currentDate = new Date();
		return formatDistanceStrict(currentDate, gotDate, { addSuffix: true });
	}

	onMount(() => {
		notificationFeed.init();
	});
</script>

{#each notificationFeed.notifications as notification (notification.id)}
	{#if notification.type == 'mention'}
		<MisskeyNote note={notification.note} />
	{:else}
		<div>{notification.type}</div>
	{/if}
{/each}
