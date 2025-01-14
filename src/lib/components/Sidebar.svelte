<script lang="ts">
	import CreateNoteForm from './CreateNoteForm.svelte';

	let { notes }: { notes: string[] } = $props();
</script>

<div class="flex shrink grow flex-col min-w-60 max-w-80 m-2 mr-1">
	<p>hoge</p>
	<CreateNoteForm {notes} />
</div>
