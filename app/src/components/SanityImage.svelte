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
	<img src={urlFor(value.asset).width(width).height(height).url()} alt={value.alt} loading="lazy" />
	<figcaption>{value.caption}</figcaption>
</figure>

<style>
	figure {
		margin: var(--space-1) 0;
		width: 100%;
	}

	img {
		display: block;
		max-width: 70%;
		height: auto;
		margin: 0 auto;
		box-shadow:
			rgba(17, 17, 26, 0.1) 0px 4px 16px,
			rgba(17, 17, 26, 0.1) 0px 8px 24px,
			rgba(17, 17, 26, 0.1) 0px 16px 56px;
	}

	@media (max-width: 768px) {
		img {
			max-width: 100%;
		}
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
