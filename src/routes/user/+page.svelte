<script lang="ts">
	import type { User, UserDetailed } from 'misskey-js/entities.js';
	import { api as misskeyApi } from 'misskey-js';
	import { onMount, setContext } from 'svelte';
	import { page } from '$app/state';
	import MfmText from '@/components/mfm-text.svelte';
	import * as mfm from 'mfm-js';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallBackAnim from '@/components/avatar-fall-back-anim.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';

	// /user?username=<username>&host=<host>

	let {
		data
	}: {
		data: {
			cookies: {
				server: string;
				token: string;
			};
		};
	} = $props();

	const cli = new misskeyApi.APIClient({
		origin: 'https://' + data.cookies.server,
		credential: data.cookies.token
	});

	let user: UserDetailed | null = $state(null);

	onMount(() => {
		if (!data.cookies.server || !data.cookies.token) return;

		const urlSearchParams = page.url.searchParams;
		const username = urlSearchParams.get('username');
		const host = urlSearchParams.get('host');

		if (username && host) {
			cli
				.request('users/show', { username: username, host: host })
				.then((got) => {
					user = got;
				})
				.catch((err) => {
					console.error(err);
				});
		} else if (username) {
			cli
				.request('users/show', { username: username })
				.then((got) => {
					user = got;
				})
				.catch((err) => {
					console.error(err);
				});
		}
	});

	setContext('client', {
		cli
	});
</script>

<div>
	{#if user}
		<div class="relative flex flex-row bg-gradient-to-b from-transparent to-black">
			<img src={user.bannerUrl} alt={'banner'} class="z-[-1] w-px max-w-3xl flex-grow" />
			<div class="absolute bottom-4 left-4 mr-4">
				<div class="flex flex-row rounded-xl bg-secondary bg-opacity-60 p-2">
					<Avatar class="h-28 w-28 rounded-xl border-4 border-foreground">
						<AvatarImage src={user.avatarUrl} />
						<AvatarFallBackAnim />
					</Avatar>
					<div class="ml-4 flex h-52 flex-col">
						{#if user.name}
							<div class="flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-3xl">
								<MfmText
									mfmNodes={mfm.parse(user.name)}
									assets={{ host: user.host, emojis: user.emojis }}
								/>
							</div>
						{/if}
						<div
							class="flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground"
						>
							{'@' + user.username + (user.host ? '@' + user.host : '')}
						</div>
						{#if user.description}
							<ScrollArea type="auto" class="my-2 pr-2">
								<div class="min-w-0 whitespace-pre-wrap text-wrap" style="word-break: break-word;">
									<MfmText
										mfmNodes={mfm.parse(user.description)}
										assets={{ host: user.host, emojis: user.emojis }}
									/>
								</div>
							</ScrollArea>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else}
		{'Loading...'}
	{/if}
</div>
