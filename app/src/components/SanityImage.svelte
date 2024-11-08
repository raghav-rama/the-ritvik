<script lang="ts">
	import type { CustomBlockComponentProps } from '@portabletext/svelte';
	import { getImageDimensions } from '@sanity/asset-utils';
	import type { ImageAsset } from '@sanity/types';
	import { urlFor } from '$lib/sanity/image';

	export let portableText: CustomBlockComponentProps<{
		asset: ImageAsset;
		caption: string;
		alt: string;
	}>;

	const { width, height } = getImageDimensions(urlFor(portableText.value.asset).url());

	$: ({ value } = portableText);
</script>

<figure>
	<img src={urlFor(value.asset).url()} alt={value.alt} width={width * 0.1} height={height * 0.1} />
	<figcaption>{value.caption}</figcaption>
</figure>

<style>
	img {
		display: block;
		margin: var(--space-1) auto;
	}
	figcaption {
		text-align: center;
		font-size: var(--font-size-1);
		line-height: var(--line-height-0);
		opacity: 0.7;
	}
</style>
