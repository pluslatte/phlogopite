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
		<div class="flex flex-row items-start text-sm">
			<Avatar class="ml-2 mt-1 rounded-lg">
				<AvatarImage src={notification.user.avatarUrl} alt={'@' + notification.user.username} />
				<AvatarFallBackAnim />
			</Avatar>
			<div class="ml-2 grid flex-grow">
				<div class="flex w-full flex-row overflow-hidden">
					{#if notification.user.name}
						<div class="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
							<MfmText
								mfmNodes={mfm.parse(notification.user.name)}
								assets={{ host: notification.user.host, emojis: notification.user.emojis }}
							/>
						</div>
					{/if}
					<div class="overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
						{'@' +
							notification.user.username +
							(notification.user.host ? '@' + notification.user.host : '')}
					</div>
					<div class="w-4"></div>
					<div class="ml-auto whitespace-nowrap text-muted-foreground">
						{GetTimestampFromISO8601(notification.createdAt)}
					</div>
				</div>
				<!-- main text -->
				{#if notification.note.text}
					<!-- https://qiita.com/ist-a-k/items/2b1385574e1a1babdde1 -->
					<div class="min-w-0 whitespace-pre-wrap text-wrap" style="word-break: break-word;">
						<MfmText
							mfmNodes={mfm.parse(notification.note.text)}
							assets={{ host: notification.note.user.host, emojis: notification.note.emojis }}
						/>
					</div>
				{/if}
				<!-- image -->
				{#if notification.note.files}
					<div class="flex flex-row flex-wrap">
						{#each notification.note.files as file}
							<img src={file.thumbnailUrl} alt={file.name} class="m-2 max-w-32 rounded-lg" />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/each}
