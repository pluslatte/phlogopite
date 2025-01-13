<script lang="ts">
	let newPost = $state('');
	let posts = $state(['Hello, Misskey', 'Hello, SvelteKit']);

	function addPost() {
		if (newPost.trim()) {
			posts.push(newPost);
		}
	}
</script>

<div class="container">
	<form class="form" onsubmit={addPost}>
		<input type="text" bind:value={newPost} placeholder="Type something..." />
		<button type="submit">Note</button>
	</form>

	{#each posts as post}
		<div class="post">{post}</div>
	{/each}
</div>
