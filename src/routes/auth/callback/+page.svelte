<script lang="ts">
	import { page } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { onMount } from 'svelte';

	interface AuthData {
		token: string;
	}

	let token = $state('');
	let host = $state('');

	onMount(() => {
		const urlSearchParams = page.url.searchParams;
		const miauthSessionId = urlSearchParams.get('session');
		if (miauthSessionId) {
			const miauthSessionHost = urlSearchParams.get('host');
			if (miauthSessionHost) {
				host = miauthSessionHost;
				const fetchTokenUrl = `https://${miauthSessionHost}/api/miauth/${miauthSessionId}/check`;
				const fetchToken = async (url: string): Promise<AuthData> => {
					const response = await fetch(url, { method: 'POST' });
					if (!response.ok) {
						throw new Error('fetchToken failed');
					}
					const data: AuthData = await response.json();
					return data;
				};
				fetchToken(fetchTokenUrl)
					.then((data) => {
						token = data.token;
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				console.error('miauthSessionId without miauthSessionHost?');
			}
		}
	});
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form method="POST" class="flex flex-row">
		<Input readonly name="server" placeholder="Server" bind:value={host} />
		<Input name="token" type="password" readonly bind:value={token} />
		<Button type="submit">Start</Button>
	</form>
	<div class="m-4 mb-1 text-4xl font-extrabold">Phlogopite</div>
	<div class="m-4 mt-0 text-sm text-muted-foreground">Misskey client</div>
</div>
