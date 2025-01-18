<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';

	import IconReply from 'lucide-svelte/icons/reply';
	import IconRepeat2 from 'lucide-svelte/icons/repeat-2';
	import IconSmilePlus from 'lucide-svelte/icons/smile-plus';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';
</script>

<div class="flex flex-row gap-8 p-2">
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconReply class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconRepeat2 class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconSmilePlus class="h-4 w-4" />
	</Button>
	<Button variant="ghost" size="icon" class="rounded-full">
		<IconEllipsis class="h-4 w-4" />
	</Button>
</div>
