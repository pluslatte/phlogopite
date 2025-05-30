<script lang="ts">
	import MfmTextRenderer from '@/components/mfm-text-renderer.svelte';
	import ToggleGroup from '@/components/ui/toggle-group/toggle-group.svelte';
	import ToggleGroupItem from '@/components/ui/toggle-group/toggle-group-item.svelte';
	import { useSidebar } from '@/components/ui/sidebar';
	import Button from '@/components/ui/button/button.svelte';
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallback from '@/components/ui/avatar/avatar-fallback.svelte';
	import AvatarFallBackAnim from '@/components/avatar-fall-back-anim.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import MisskeyUserNotes from './misskey-user-notes.svelte';

	import type { UserDetailed } from 'misskey-js/entities.js';
	import * as mfm from 'mfm-js';
	import type { IResponse } from 'misskey-js/entities.js';

	import IconArrowLeftFromLine from 'lucide-svelte/icons/arrow-left-from-line';
	import IconHouse from 'lucide-svelte/icons/house';
	import Separator from './ui/separator/separator.svelte';
	import { getApiClientContext } from '@/api-client-context';

	// /user/[username]/[host]

	let {
		username,
		host
	}: {
		username: string;
		host?: string | null;
	} = $props();

	const misskeyApiClient = getApiClientContext();
	const sidebar = useSidebar();

	let self: IResponse | null = $state(null);
	let user: UserDetailed | null = $state(null);
	let noteListType: string = $state('normal');

	$effect(() => {
		let isCancelled = false;
		misskeyApiClient.request('i', {}).then((got) => {
			self = got;
		});
		if (username && host) {
			misskeyApiClient
				.request('users/show', { username: username, host: host })
				.then((got) => {
					if (!isCancelled) {
						user = got;
					}
				})
				.catch((err) => {
					console.error(err);
				});
		} else if (username) {
			misskeyApiClient
				.request('users/show', { username: username })
				.then((got) => {
					if (!isCancelled) {
						user = got;
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}

		return () => {
			isCancelled = true;
		};
	});
</script>

<div class="relative flex h-full flex-col overflow-auto">
	<Button
		class="absolute left-0 m-2 flex flex-row items-center gap-4 rounded-lg border"
		size="icon"
		variant="ghost"
		onclick={sidebar.toggle}
	>
		{#if sidebar.open}
			<IconArrowLeftFromLine />
		{:else}
			<Avatar class="size-8 rounded-md">
				<AvatarImage src={self?.avatarUrl} alt={'@' + self?.username} />
				<AvatarFallback>...</AvatarFallback>
			</Avatar>
		{/if}
	</Button>
	<a
		href="/"
		class="absolute right-0 m-2 flex size-10 flex-row items-center justify-center gap-4 rounded-lg border border-primary bg-primary text-primary-foreground"
	>
		<IconHouse class="size-4" />
	</a>
	<div class="flex flex-row justify-center">
		<ToggleGroup type="single" bind:value={noteListType} class="p-2">
			<ToggleGroupItem value="normal">
				<span>notes</span>
			</ToggleGroupItem>
			<ToggleGroupItem value="withReplies">
				<span>withReplies</span>
			</ToggleGroupItem>
			<ToggleGroupItem value="onlyFiles">
				<span>onlyFiles</span>
			</ToggleGroupItem>
		</ToggleGroup>
	</div>
	<Separator />
	{#if user}
		<ScrollArea type="auto">
			<div
				class="relative flex justify-center bg-gradient-to-b from-transparent to-white dark:to-black"
			>
				<img src={user.bannerUrl} alt={'banner'} class="z-[-1] h-[18rem] w-[48rem] object-cover" />
				<div class="absolute bottom-0 left-0 w-full">
					<div class="m-2 flex max-w-full rounded-xl bg-card bg-opacity-60">
						<Avatar class="m-2 size-16 rounded-xl border-4 border-foreground">
							<AvatarImage src={user.avatarUrl} />
							<AvatarFallBackAnim />
						</Avatar>
						<div class="ml-4 flex max-h-52 min-w-0 flex-col">
							{#if user.name}
								<div
									class="min-w-0 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap pt-1 text-xl"
								>
									<MfmTextRenderer
										mfmNodes={mfm.parse(user.name)}
										assets={{ host: user.host, emojis: user.emojis }}
									/>
								</div>
							{/if}
							<div
								class="min-w-0 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground"
							>
								{'@' + user.username + (user.host ? '@' + user.host : '')}
							</div>
							{#if user.description}
								<ScrollArea type="auto" class="my-2 pr-2">
									<div
										class="min-w-0 whitespace-pre-wrap text-wrap text-sm"
										style="word-break: break-word;"
									>
										<MfmTextRenderer
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
			<div class="ml-1 mr-2 mt-2">
				{#key noteListType}
					<MisskeyUserNotes {noteListType} {user} />
				{/key}
			</div>
		</ScrollArea>
	{:else}
		{'Loading...'}
	{/if}
</div>
