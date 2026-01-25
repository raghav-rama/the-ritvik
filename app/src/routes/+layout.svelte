<script lang="ts">
	import { PreviewMode, VisualEditing, LiveLoader } from '@sanity/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import type { LayoutProps } from './$types';
	import { client } from '$lib/sanity/client';

	injectSpeedInsights();

	const { children, data }: LayoutProps = $props();
	const { browserToken, previewEnabled, previewPerspective } = $derived(data);
</script>

<PreviewMode enabled={previewEnabled}>
	<VisualEditing enabled={previewEnabled}>
		<LiveLoader {client} {previewEnabled} {previewPerspective} {browserToken}>
			{@render children()}
		</LiveLoader>
	</VisualEditing>
</PreviewMode>
