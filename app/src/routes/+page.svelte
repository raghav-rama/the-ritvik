<script lang="ts">
	import { useQuery } from '@sanity/svelte-loader';
	import Card from '@/components/Card.svelte';
	import Welcome from '@/components/Welcome.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const q = useQuery(data);

	$: ({ data: posts } = $q);
	$: ({ metadata } = data);
</script>

<section>
	{#if posts.length}
		{#each posts as post}
			<Card {post} />
		{/each}
	{:else}
		<Welcome />
	{/if}
</section>

<svelte:head>
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description} />

	<!-- Favicon -->
	<link rel="icon" type="image/png" href="/favicon.png" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:image" content={metadata.image} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />
	<meta name="twitter:image" content={metadata.image} />

	<meta name="keywords" content="Software Engineer, Ritvik Singh, Blockchain, Web3, Spirituality" />
	<meta name="author" content="Ritvik Singh" />
	<meta name="theme-color" content="#FF0000" />
</svelte:head>
