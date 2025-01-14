<script lang="ts">
	import Main from '$lib/components/Main.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let notes = $state(['Hello, Misskey', 'Hello, SvelteKit']);
</script>

<div class="container">
	<div class="flex flex-row h-screen w-screen">
		<Sidebar {notes} />
		<Main {notes} />
	</div>
</div>
