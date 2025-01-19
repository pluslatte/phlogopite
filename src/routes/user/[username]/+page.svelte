<script lang="ts">
	import type { PhlogopiteCookies } from '@/phlogopite-cookies';
	import MisskeyUserPage from '@/components/misskey-user-page.svelte';

	// /user?username=<username>&host=<host>

	let {
		data
	}: {
		data: {
			cookies: PhlogopiteCookies;
			username: string;
		};
	} = $props();
</script>

<MisskeyUserPage cookies={data.cookies} username={data.username} />
