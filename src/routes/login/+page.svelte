<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
</script>

<div>
	<form method="POST">
		<Input name="server" placeholder="Server" />
		<Input name="token" type="password" placeholder="Token" />
		<Button type="submit">Log in</Button>
	</form>
</div>
