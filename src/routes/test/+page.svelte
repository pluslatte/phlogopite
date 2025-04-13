<script lang="ts">
	import Textarea from '@/components/ui/textarea/textarea.svelte';

	let hoge = $state('hoge');
</script>

<Textarea bind:value={hoge}></Textarea>
<p>{hoge}</p>
