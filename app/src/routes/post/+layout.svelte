<script lang="ts">
	import type { LayoutProps } from './$types';
	import BlogLayout from '@/components/BlogLayout.svelte';

	const { children }: LayoutProps = $props();
</script>

<BlogLayout {children} />
