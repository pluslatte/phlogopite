<script lang="ts">
	import CreateNoteForm from './CreateNoteForm.svelte';

	let { notes }: { notes: string[] } = $props();
</script>

<div class="shrink grow flex-col h-full min-w-60 max-w-80">
	<CreateNoteForm {notes} />
	<div>
		<p>hoge</p>
	</div>
</div>
