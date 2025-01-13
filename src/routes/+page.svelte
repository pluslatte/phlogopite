<script lang="ts">
	import TimeLine from '$lib/components/TimeLine.svelte';

	let newPost = $state('');
	let notes = $state(['Hello, Misskey', 'Hello, SvelteKit']);

	function addPost() {
		if (newPost.trim()) {
			notes.push(newPost);
		}
	}
</script>

<div class="container">
	<form class="form" onsubmit={addPost}>
		<input type="text" bind:value={newPost} placeholder="Type something..." />
		<button type="submit">Note</button>
	</form>
	<TimeLine {notes} />
</div>
