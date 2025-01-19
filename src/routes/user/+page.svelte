<script lang="ts">
	import type { User, UserDetailed } from 'misskey-js/entities.js';
	import { api as misskeyApi } from 'misskey-js';
	import { onMount, setContext } from 'svelte';
	import { page } from '$app/state';
	import MfmText from '@/components/mfm-text.svelte';
	import * as mfm from 'mfm-js';

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
		<div class="flex flex-row justify-center">
			<img src={user.bannerUrl} alt={'banner'} class="max-w-3xl" />
		</div>
		{#if user.name}
			<MfmText mfmNodes={mfm.parse(user.name)} assets={{ host: user.host, emojis: user.emojis }} />
		{/if}
	{:else}
		{'Loading...'}
	{/if}
</div>
