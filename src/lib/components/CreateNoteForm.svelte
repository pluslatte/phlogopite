<script lang="ts">
	let newPost = $state('');

	let { notes }: { notes: string[] } = $props();

	function addPost() {
		if (newPost.trim()) {
			notes.push(newPost);
		}
	}
</script>

<div class="shrink grow m-2 flex flex-col">
	<textarea
		bind:value={newPost}
		placeholder="Type something..."
		class="shrink grow basis-0 border-4 border-neutral-600 bg-neutral-600 text-white rounded-t-md"
	></textarea>
	<button onclick={addPost} class="h-10 bg-neutral-700 text-white rounded-b-md"> Note </button>
</div>
