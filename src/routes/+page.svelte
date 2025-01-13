<script lang="ts">
	import { createScrollArea, melt } from '@melt-ui/svelte';

	let newPost = $state('');
	let posts = $state(['Hello, Misskey', 'Hello, SvelteKit']);

	function addPost() {
		if (newPost.trim()) {
			posts.push(newPost);
		}
	}

	const {
		elements: { root, content, viewport, corner, scrollbarY, thumbY }
	} = createScrollArea({
		type: 'always',
		dir: 'ltr'
	});
</script>

<div class="container">
	<form class="form" onsubmit={addPost}>
		<input type="text" bind:value={newPost} placeholder="Type something..." />
		<button type="submit">Note</button>
	</form>

	<div
		use:melt={$root}
		class="relative h-72 w-56 overflow-hidden rounded-md border border-neutral-700 bg-neutral-800/90 text-white shadow-lg"
	>
		<div use:melt={$viewport} class="h-full w-full rounded-[inherit]">
			<div use:melt={$content}>
				<div class="p-7">
					<h4 class="mb-4 font-semibold leading-none">Endless Flavors</h4>
					{#each posts as post}
						<div>{post}</div>
						<div role="separator" class="my-2 h-px w-full bg-magnum-800/30" />
					{/each}
				</div>
			</div>
		</div>
		<div
			use:melt={$scrollbarY}
			class="flex h-full w-2.5 touch-none select-none border-l border-l-transparent bg-neutral-300/10 p-px transition-colors"
		>
			<div use:melt={$thumbY} class="relative flex-1 rounded-full bg-neutral-300/50" />
		</div>
		<div use:melt={$corner} />
	</div>
</div>
