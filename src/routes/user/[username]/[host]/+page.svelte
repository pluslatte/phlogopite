<script lang="ts">
	import MisskeyUserPage from '@/components/misskey-user-page.svelte';

	// /user?username=<username>&host=<host>

	let {
		data
	}: {
		data: {
			username: string;
			host?: string | null;
		};
	} = $props();
</script>

<MisskeyUserPage username={data.username} host={data.host} />
