<script lang="ts">
	import type { User } from 'misskey-js/entities.js';
	import { api as misskeyApi } from 'misskey-js';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

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

	let user: User | null = $state(null);

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
</script>

<div>
	{#if user}
		{user.name}
	{:else}
		{'Loading...'}
	{/if}
</div>
