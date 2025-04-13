<script lang="ts">
	import Avatar from '@/components/ui/avatar/avatar.svelte';
	import AvatarImage from '@/components/ui/avatar/avatar-image.svelte';
	import AvatarFallBackAnim from './avatar-fall-back-anim.svelte';
	import PhlogopiteUserLink from './phlogopite-user-link.svelte';
	import type { IResponse } from 'misskey-js/entities.js';
	import { api as misskeyApi } from 'misskey-js';
	import { getApiClientContext } from '@/api-client-context';
	import { onMount } from 'svelte';

	let self: IResponse | null = $state(null);

	let misskeyApiClient: misskeyApi.APIClient = getApiClientContext();
	if (!misskeyApiClient) {
		console.error('no misskeyApiClient found');
	}

	onMount(() => {
		misskeyApiClient.request('i', {}).then((got) => {
			self = got;
		});
	});
</script>

<div class="flex flex-row">
	{#if self}
		<PhlogopiteUserLink username={self.username}>
			<Avatar class="rounded-lg">
				<AvatarImage src={self?.avatarUrl} alt={'@' + self?.username} />
				<AvatarFallBackAnim />
			</Avatar>
		</PhlogopiteUserLink>
	{/if}
	<div class="flex-frow ml-2 grid grid-flow-row text-sm">
		<span class="overflow-hidden text-ellipsis font-bold">{self?.name}</span>
		<span class="overflow-hidden text-ellipsis text-muted-foreground">
			{'@' + self?.username}
		</span>
	</div>
</div>
