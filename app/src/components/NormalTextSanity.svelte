<script lang="ts">
	import type { PortableTextListItemType } from '@portabletext/types';
	import type { ListItemComponentProps as ListItemComponent } from '@portabletext/svelte';

	export let portableText:
		| Record<PortableTextListItemType, ListItemComponent | undefined>
		| ListItemComponent;

	portableText.value;
</script>

<li>
	<slot />
</li>

<style>
	li {
		margin-bottom: var(--space-0);
		list-style-type: circle;
	}
</style>
