<script lang="ts">
	import { parseISO, formatDistanceStrict } from 'date-fns';
	import { onMount } from 'svelte';

	let { iso }: { iso: string } = $props();
	let text = $state('');

	function update() {
		text = formatDistanceStrict(new Date(), parseISO(iso), { addSuffix: true });
	}

	onMount(() => {
		update();
		const interval = setInterval(update, 3000);
		return () => clearInterval(interval);
	});
</script>

<span>{text}</span>
