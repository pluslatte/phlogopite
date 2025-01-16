<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
</script>

<div class="flex flex-col items-center justify-center h-full">
	<form method="POST" action="?/login" class="flex flex-row">
		<Input name="server" placeholder="Server" />
		<Button type="submit">Authenticate</Button>
	</form>
	<div class="text-4xl font-extrabold m-4 mb-1">Phlogopite</div>
	<div class="text-sm text-muted-foreground m-4 mt-0">Misskey client</div>
</div>
