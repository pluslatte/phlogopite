<script lang="ts">
	import { page } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { onMount } from 'svelte';

	interface AuthData {
		token: string;
	}

	let clientUrl = $state(page.url);

	onMount(() => {
		const urlSearchParams = page.url.searchParams;
		const miauthSessionId = urlSearchParams.get('session');
		if (miauthSessionId) {
			const miauthSessionHost = urlSearchParams.get('host');
			if (miauthSessionHost) {
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
						console.log(data.token);
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

<div class="flex flex-col items-center justify-center h-full">
	<form method="POST" class="flex flex-row">
		<Input name="server" placeholder="Server" />
		<Input name="clientUrl" bind:value={clientUrl} />
		<Button type="submit">Authenticate</Button>
	</form>
	<div class="text-4xl font-extrabold m-4 mb-1">Phlogopite</div>
	<div class="text-sm text-muted-foreground m-4 mt-0">Misskey client</div>
</div>
