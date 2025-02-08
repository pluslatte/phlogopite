<script lang="ts">
	import MisskeyUserPage from '@/components/misskey-user-page.svelte';

	// /user?username=<username>

	let {
		data
	}: {
		data: {
			username: string;
		};
	} = $props();
</script>

<MisskeyUserPage username={data.username} />
