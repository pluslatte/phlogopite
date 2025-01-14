<script lang="ts">
	let newPost = $state('');

	let { notes }: { notes: string[] } = $props();

	function addPost() {
		if (newPost.trim()) {
			notes.push(newPost);
		}
	}
</script>

<div class="m-2 shrink grow flex flex-col min-w-60 max-w-80">
	<textarea
		bind:value={newPost}
		placeholder="Type something..."
		class="shrink grow basis-0 border-4 border-neutral-600 bg-neutral-600 text-white rounded-t-md"
	></textarea>
	<button
		onclick={addPost}
		class="shrink grow basis-0 min-h-10 max-h-10 bg-neutral-700 text-white rounded-b-md"
	>
		Note
	</button>
</div>
