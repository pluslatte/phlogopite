<script lang="ts">
	import Textarea from '@/components/ui/textarea/textarea.svelte';

	let hoge = $state('hoge');
</script>

<Textarea bind:value={hoge}></Textarea>
<p>{hoge}</p>
<img
	src="https://media.virtualkemomimi.net/files/thumbnail-331d4bf2-7d8c-4f0a-8367-20cb6dff564c.webp"
	alt="waaaaaa"
/>
