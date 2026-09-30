<script lang="ts">
	import Card from '@/components/Card.svelte';
	import BlogLayout from '@/components/BlogLayout.svelte';
	import Welcome from '@/components/Welcome.svelte';
	import type { PageProps } from './$types';
	import type { Post } from '@/lib/sanity/queries';

	const { data }: PageProps = $props();
	const posts: Post[] = $derived(data.options.initial.data ?? []);
	const metadata = $derived(data.metadata);
</script>

<BlogLayout wide>
	<div class="landing">
		<h1 class="landing__title">The Ritvik Blog</h1>
		<section aria-label="Recent posts">
			{#if posts.length}
				{#each posts as post, index (post.slug.current)}
					<Card {post} loading={index === 0 ? 'eager' : 'lazy'} />
				{/each}
			{:else}
				<Welcome />
			{/if}
		</section>
	</div>
</BlogLayout>

<svelte:head>
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description} />
	<link rel="canonical" href="https://www.theritvik.in" />
	<meta name="robots" content="index, follow" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:image" content={metadata.image} />
	<meta property="og:site_name" content="The Ritvik Blog" />
	<meta property="og:url" content="https://www.theritvik.in" />
	<meta property="og:locale" content="en_US" />
	<meta property="article:author" content="Ritvik Singh" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />
	<meta name="twitter:image" content={metadata.image} />
	<meta name="twitter:creator" content="@Raghav__Rama" />
	<meta name="twitter:site" content="@Raghav__Rama" />

	<meta
		name="keywords"
		content="Software Engineer, Ritvik Singh, Blockchain, Web3, Spirituality, Technology Blog, Web Development"
	/>
	<meta name="author" content="Ritvik Singh" />
	<meta name="theme-color" content="#FF0000" />

	<meta name="language" content="English" />
	<meta name="geo.region" content="IN" />

	{@html `
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "Ritvik Singh",
			"url": "https://www.theritvik.in",
			"sameAs": [
				"https://github.com/raghav-rama",
				"https://www.linkedin.com/in/ritviksingh258",
				"https://twitter.com/Raghav__Rama",
				"https://t.me/TheRitvikS",
				"https://www.youtube.com/@hackerboy5328"
			]
		}
	</script>
	`}
</svelte:head>

<style>
	.landing {
		padding: var(--space-4) 0;
	}

	.landing__title {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
</style>
