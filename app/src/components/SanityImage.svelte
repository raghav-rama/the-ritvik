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
	<img src={urlFor(value.asset).width(width).height(height).url()} alt={value.alt} />
	<figcaption>{value.caption}</figcaption>
</figure>

<style>
	figure {
		margin: var(--space-1) 0;
		width: 100%;
	}

	img {
		display: block;
		max-width: 100%;
		height: auto;
		margin: 0 auto;
		box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
	}

	figcaption {
		text-align: center;
		font-size: var(--font-size-1);
		line-height: var(--line-height-0);
		opacity: 0.7;
		padding: 0 1rem;
		margin-top: 5px;
	}
</style>
