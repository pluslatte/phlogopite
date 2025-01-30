<!-- to -> /user/<username>/<host?> -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		username,
		host,
		children
	}: { username: string; host?: string | null; children?: Snippet<[]> } = $props();
</script>

<a href={`/user/${username}${host ? '/' + host : ''}`}>
	{@render children?.()}
</a>
