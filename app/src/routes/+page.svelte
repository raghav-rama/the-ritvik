<script lang="ts">
	import Card from '@/components/Card.svelte';
	import Welcome from '@/components/Welcome.svelte';
	import type { PageProps } from './$types';
	import type { Post } from '@/lib/sanity/queries';

	const { data }: PageProps = $props();
	const posts: Post[] = $derived(data.options.initial.data ?? []);
	const metadata = $derived(data.metadata);
</script>

<main class="landing">
	<header class="landing__header">
		<h1>The Ritvik Blog</h1>
		<p>Notes on software, technology, and life.</p>
	</header>
	<section aria-label="Recent posts">
		{#if posts.length}
			{#each posts as post, index (post.slug.current)}
				<Card {post} loading={index === 0 ? 'eager' : 'lazy'} />
			{/each}
		{:else}
			<Welcome />
		{/if}
	</section>
</main>

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
		box-sizing: border-box;
		width: 100%;
		max-width: 1040px;
		margin: 0 auto;
		padding: clamp(24px, 5vw, 64px) clamp(20px, 4vw, 40px);
	}

	.landing__header {
		padding-bottom: var(--space-5);
		border-bottom: 1px solid var(--gray-200);
	}

	h1 {
		margin: 0 0 var(--space-3);
		font-size: clamp(1.75rem, 4vw, 2.25rem);
		font-weight: 800;
		line-height: 1.2;
		letter-spacing: -0.025em;
	}

	.landing__header p {
		margin: 0;
		color: var(--gray-600);
		font-family: var(--font-family-serif), serif;
		font-size: var(--font-size-3);
		line-height: 1.6;
	}
</style>
