<script lang="ts">
	import CreateNoteForm from '$lib/components/CreateNoteForm.svelte';
	import TimeLine from '$lib/components/TimeLine.svelte';

	let notes = $state(['Hello, Misskey', 'Hello, SvelteKit']);
</script>

<div class="container">
	<div class="flex flex-row h-screen w-screen">
		<CreateNoteForm {notes} />
		<TimeLine {notes} />
	</div>
</div>
