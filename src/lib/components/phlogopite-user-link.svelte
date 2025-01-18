<!-- to -> /user?username=<username>&host=<host> -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { username, host, children }: { username: string; host?: string; children?: Snippet<[]> } =
		$props();
</script>

<a href={`/user?username=${username}${host ? '&host=' + host : ''}`}>
	{@render children?.()}
</a>
