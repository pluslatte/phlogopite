<script lang="ts">
	import type { User } from 'misskey-js/entities.js';
	import { api as misskeyApi } from 'misskey-js';
	import { onMount } from 'svelte';

	let {
		data
	}: {
		data: {
			username: string;
			host: string;
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

		cli
			.request('users/show', { username: data.username, host: data.host })
			.then((got) => {
				user = got;
			})
			.catch((err) => console.error(err));
	});
</script>

<div>
	{#if user}
		{user.name}
	{:else}
		{'Loading...'}
	{/if}
</div>
