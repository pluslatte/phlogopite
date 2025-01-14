<script lang="ts">
	import ToggleGroupItem from './ui/toggle-group/toggle-group-item.svelte';
	import ToggleGroup from './ui/toggle-group/toggle-group.svelte';
</script>

<div
	class="flex min-w-full justify-center gap-4 rounded-t-md bg-neutral-800/90 px-3 py-3 text-white"
>
	<ToggleGroup type="single">
		<ToggleGroupItem class="bg-neutral-600" value="timeline home">H</ToggleGroupItem>
		<ToggleGroupItem class="bg-neutral-600" value="timeline local">L</ToggleGroupItem>
		<ToggleGroupItem class="bg-neutral-600" value="timeline social">S</ToggleGroupItem>
		<ToggleGroupItem class="bg-neutral-600" value="timeline global">G</ToggleGroupItem>
	</ToggleGroup>
</div>
