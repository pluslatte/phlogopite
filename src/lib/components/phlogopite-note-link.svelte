<!-- to -> /note/<noteId> -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { noteId, children }: { noteId: string; children?: Snippet<[]> } = $props();
</script>

<a href={`/note/${noteId}`}>
	{@render children?.()}
</a>
