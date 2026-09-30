<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<li>
	{@render children?.()}
</li>

<style>
	li {
		margin-bottom: var(--space-0);
		list-style-type: circle;
	}
</style>
