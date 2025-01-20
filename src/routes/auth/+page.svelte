<script lang="ts">
	import { page } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';

	let clientUrl = $state(page.url);
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form method="POST" class="flex flex-row">
		<Input name="server" placeholder="Server" />
		<Input name="clientUrl" readonly bind:value={clientUrl} />
		<Button type="submit">Authenticate</Button>
	</form>
	<div class="m-4 mb-1 text-4xl font-extrabold">Phlogopite</div>
	<div class="m-4 mt-0 text-sm text-muted-foreground">Misskey client</div>
</div>
